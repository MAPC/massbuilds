import Component from '@ember/component';
import config from 'massbuilds/config/environment';
import { service } from 'ember-decorators/service';
import { action, computed } from 'ember-decorators/object';


export default class extends Component {

  @service session
  

  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'form-subpanel', 'login-subpanel'];

    this.username = '';
    this.password = '';

    this.errorMessage = null;
    this.isLoggingIn = false;
  }


  @computed('username', 'password') 
  get submittable() {
    return ['username','password'].every(field => this.get(field) !== '');
  }


  @action
  login() {
    if (!this.get('submittable')) {
      return;
    }

    const session = this.get('session');
    const { username, password } = this.getProperties('username', 'password');

    this.set('isLoggingIn', true);

    session
      .authenticate('authenticator:devise', username, password)
      .catch(e => {
        console.log(e);
        if (e.message && e.message === 'Disabled user') {
          this.set('errorMessage', `This account was disabled by an admin. Please contact ${config.admin.email} for more information.`);
        }
        else {
          this.set('errorMessage', 'Cannot login at this time.');
        }
      })
      .finally(() => {
        this.set('isLoggingIn', false);
      });
  }


  @action
  showSignupPanel() {
    this.sendAction('showSignupPanel');
  }

}
