import Component from '@ember/component';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Component {

  @service session
  

  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'login-subpanel'];

    this.username = '';
    this.password = '';

    this.errorMessage = null;
  }


  @action
  login() {
    const session = this.get('session');
    const { username, password } = this.getProperties('username', 'password');

    session
    .authenticate('authenticator:devise', username, password)
    .catch(e => {
      this.set('errorMessage', 'Cannot login at this time.');
    });
  }


  @action
  showSignupPanel() {
    this.sendAction('showSignupPanel');
  }

}
