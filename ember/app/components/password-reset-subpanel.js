import Component from '@ember/component';
import config from 'massbuilds/config/environment';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default class extends Component {

  @service ajax
  @service notifications

  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'password-reset-subpanel', 'signup-subpanel'];

    this.username = '';

    this.isResetting = false;
    this.loadingText = 'Resetting Password';
  }

  @computed('username')
  get submittable() {
    return (this.get('username') !== '');
  }

  @action
  resetPassword() {
    if (this.get('submittable') && !this.get('isResetting')) {
      const email = this.get('username');
      this.set('isCreating', true);

      this.get('ajax').post(`${config.host}/password_resets`, {
        body: { email },
      })
      .then(result => {
        this.get('notifications').show(`You have successfully reset your password for ${email}! Please check your email.`);
        this.sendAction('redirect');
      })
      .catch(() => {
        // Maybe errors? 
      })
      .finally(() => {
        this.set('isCreating', false);
      });
    }
  }

}
