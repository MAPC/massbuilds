import Ember from 'ember';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import Development from 'massbuilds/models/development';
import castToModel from 'massbuilds/utils/cast-to-model';
import { action, computed } from 'ember-decorators/object';


export default class extends Controller {

  @service currentUser
  @service notifications


  @computed('currentUser.user', 'model')
  get hasPublishPermissions() {
    const user = this.get('currentUser.user') ;
    const model = this.get('model');

    return (
      user.get('role') === 'admin'
      || (
        user.get('role') === 'municipal'
        && user.get('municipality') === model.get('municipal')
      )
    );
  }


  @computed('hasPublishPermissions')
  get submitText() {
    const hasPermissions = this.get('hasPublishPermissions');

    return hasPermissions ? 'Publish Changes' : 'Submit for Review';
  }


  @computed('hasPublishPermissions')
  get loadingSpinnerText() {
    const hasPermissions = this.get('hasPublishPermissions') ;

    return hasPermissions ? 'Publishing' : 'Submitting';
  }


  @action
  createEdit(changes) {
    const development = this.get('model');
    const user = this.get('currentUser.user');
    const approved = this.get('hasPublishPermissions');
    const proposedChanges = castToModel(Development, changes);

    const editSchema = { user, development, approved, proposedChanges };
    const newEdit = this.get('store').createRecord('edit', editSchema);

    if (newEdit) {
      this.set('isCreating', true);

      newEdit
        .save()
        .then(() => this.get('store').findRecord('development', development.get('id')))
        .then(() => {
          const action = approved ? 'published edits' : 'submitted edits for review';
          const developmentName = development.get('name');

          this.get('notifications').show(`You have ${action} to ${developmentName}.`)

          this.transitionToRoute('map.developments.development.index', this.get('model'));
        })
        .finally(() => {
          this.set('isCreating', false);
        });
    }
  }

}
