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
          this.get('notifications').show(`You have denied ${municipality} membership to ${fullName}.`);
          this.get('verifiableUsers').decrementCount();
        })
        .catch(() => {
          user.set('requestVerifiedStatus', true);

          this.get('notifications').show(`An error occurred when denying ${municipality} membership to ${fullName}.`, { mode: 'error' });
        });
  }


  @action
  approveUser(user) {
    const { municipality, fullName } = user.getProperties('municipality', 'fullName');
    if (municipality) {
      user.set('role', 'municipal');
    } else {
      user.set('role', 'verified');
    }
    user.set('requestVerifiedStatus', false);
    user.save()
        .then(() => {
          this.get('notifications').show(`You have approved ${municipality} membership to ${fullName}.`);
          this.get('verifiableUsers').decrementCount();
        })
        .catch(() => {
          user.set('role', 'user');
          user.set('requestVerifiedStatus', true);

          this.get('notifications').show(`An error occurred when approving ${municipality} membership to ${fullName}.`, { mode: 'error' });
        });
  }

}
