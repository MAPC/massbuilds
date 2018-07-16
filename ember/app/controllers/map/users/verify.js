import Controller from '@ember/controller';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Controller {

  @service notifications
  @service verifiableUsers


  @computed('model.@each.requestVerifiedStatus')
  get users() {
    return this.get('model').filterBy('requestVerifiedStatus', true);
  }


  @action
  denyUser(user) {
    const { municipality, fullName } = user.getProperties('municipality', 'fullName');

    user.set('requestVerifiedStatus', false);
    user.save()
        .then(() => {
          if (municipality == 'STATE') {
            this.get('notifications').show(`You have denied verified status to ${fullName}.`);
          } else {
            this.get('notifications').show(`You have denied ${municipality} membership to ${fullName}.`);
          }

          this.get('verifiableUsers').decrementCount();
        })
        .catch(() => {
          user.set('requestVerifiedStatus', true);
          if (municipality == 'STATE') {
            this.get('notifications').show(`An error occurred when denying verified status to ${fullName}.`, { mode: 'error' });
          } else {
            this.get('notifications').show(`An error occurred when denying ${municipality} membership to ${fullName}.`, { mode: 'error' });
          }
        });
  }


  @action
  approveUser(user) {
    const { municipality, fullName } = user.getProperties('municipality', 'fullName');
    if (municipality && municipality != 'STATE') {
      user.set('role', 'municipal');
    } else {
      user.set('role', 'verified');
    }
    user.set('requestVerifiedStatus', false);
    user.save()
        .then(() => {
          if (municipality == 'STATE') {
            this.get('notifications').show(`You have approved verified status for ${fullName}.`);
          } else {
            this.get('notifications').show(`You have approved ${municipality} membership to ${fullName}.`);
          }
          this.get('verifiableUsers').decrementCount();
        })
        .catch(() => {
          user.set('role', 'user');
          user.set('requestVerifiedStatus', true);
          if (municipality == 'STATE') {
            this.get('notifications').show(`An error occurred when approving verified status for ${fullName}.`, { mode: 'error' });
          } else {
            this.get('notifications').show(`An error occurred when approving ${municipality} membership to ${fullName}.`, { mode: 'error' });
          }

        });
  }

}
