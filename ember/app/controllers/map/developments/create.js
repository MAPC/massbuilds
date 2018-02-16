import Ember from 'ember';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import Development from 'massbuilds/models/development';
import castToModel from 'massbuilds/utils/cast-to-model';
import { action, computed } from 'ember-decorators/object';


export default class extends Controller {

  @service currentUser
  @service notifications


  @computed('currentUser.user.role')
  get hasPublishPermissions() {
    return this.get('currentUser.user.role') !== 'user';
  }
  

  @computed('hasPublishPermissions')
  get submitText() {
    return this.get('hasPublishPermissions') ? 'Create Development' : 'Submit for Review';
  }


  @action 
  createDevelopment(data) {
    const model = this.get('model');
    data = castToModel(Development, data);

    Object.keys(data).forEach(attr => model.set(Ember.String.camelize(attr), data[attr]));

    model.set('state', 'MA');
    model.set('user', this.get('currentUser.user'));

    model.save().then(development => {
      this.get('notifications').show(`You have created a new development called ${data.name}`);
      this.transitionToRoute('map.developments.development', development);
    });
  }


  @action
  createEdit(data) {
    data['state'] = 'MA';

    const newEdit = this.get('store').createRecord('edit', {
      user: this.get('currentUser.user'),
      approved: false,
      proposedChanges: castToModel(Development, data),
    });

    newEdit.save().then(() => {
      this.get('notifications').show(`You have created a new development. It may be published after review from a moderator.`);
      this.transitionToRoute('map.moderations.for.user', this.get('currentUser.user.id'));
    });
  }

}
