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
    user.set('requestVerifiedStatus', false);
    user.save()
        .then(() => {
          const { municipality, fullName } = user.getProperties('municipality', 'fullName');

          this.get('notifications').show(`You have denied ${municipality} membership to ${fullName}.`);
          this.get('verifiableUsers').decrementCount();
        });
  }


  @action
  approveUser(user) {
    user.set('role', 'municipal');
    user.set('requestVerifiedStatus', false);
    user.save()
        .then(() => {
          const { municipality, fullName } = user.getProperties('municipality', 'fullName');

          this.get('notifications').show(`You have approved ${municipality} membership to ${fullName}.`);
          this.get('verifiableUsers').decrementCount();
        });
  }

}
