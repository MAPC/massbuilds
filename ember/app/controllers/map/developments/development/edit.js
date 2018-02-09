import Ember from 'ember';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import Development from 'massbuilds/models/development';
import castToModel from 'massbuilds/utils/cast-to-model';
import { action, computed } from 'ember-decorators/object';


export default class extends Controller {

  @service currentUser

 
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
 

  @action
  createEdit(proposedChanges) {
    const newEdit = this.get('store').createRecord('edit', {
      development: this.get('model'),
      user: this.get('currentUser.user'),
      approved: this.get('hasPublishPermissions'),
      proposedChanges: castToModel(Development, proposedChanges),
    });

    newEdit.save().then(() => {
      this.transitionToRoute('map.developments.development.index', this.get('model'));
      console.log("transitioned");
    });
  }

}
