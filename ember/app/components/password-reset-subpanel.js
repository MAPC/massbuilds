import Component from '@ember/component';
import config from 'massbuilds/config/environment';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default class extends Component {

  @service ajax
  @service notifications

  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'form-subpanel', 'password-reset-subpanel'];

    this.username = '';

    this.errorMessage = null;
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
      this.set('isResetting', true);
      this.set('errorMessage', null);

      const email = this.get('username');

      this.get('ajax').post(`${config.host}/password_resets`, {
        contentType: 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
        data: { email },
      })
      .then(() => {
        this.get('notifications').show(`You have successfully reset your password for ${email}! Please check your email.`);
        this.sendAction('redirect');
      })
      .catch(() => {
        this.set('errorMessage', 'We could not reset your password at this time.');
      })
      .finally(() => {
        this.set('isResetting', false);
      });
    }
  }

}
