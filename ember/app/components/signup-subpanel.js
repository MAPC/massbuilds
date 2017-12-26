import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Component {

  @service session
  @service store


  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'signup-subpanel'];

    this.fullName = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';

    this.errorMessage = null;
  }


  @computed('fullName', 'username', 'password', 'confirmPassword')
  get submittable() {

    console.log("hello");

    return [
      'fullName', 
      'username',
      'password', 
      'confirmPassword'
    ].every(field => this.get(field) !== '');
  }


  @action
  signup() {
    if (!this.get('submittable')) {
      return;
    }

    let noErrors = true; 
    let errorMessage = 'You must fill in all fields.';

    const email = this.get('username');
    const [ firstName, lastName, otherName ] = this.get('fullName').split(' ');
    const { password, confirmPassword } = this.getProperties('password', 'confirmPassword');


    /**
     * Validations
     */

    if (!email) {
      noErrors = false; 
    }

    if (firstName && lastName) {
      const nameRegex = /^[A-Za-z\-\']+$/;

      if ([firstName,lastName].any(name => !nameRegex.test(name))) {
        noErrors = false; 
        errorMessage = 'Name may only contain letters.';
      }
    }
    else {
      noErrors = false; 

      if (!lastName) {
        errorMessage = 'Must enter both a first and last name.';
      }
    }

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        noErrors = false; 
        errorMessage = 'Passwords do not match.';
      }
    }
    else {
      noErrors = false; 
    }


    /**
     * Create new user and login.
     */

    if (noErrors) {
      const userSchema = { firstName, lastName, email, password };

      this.get('store')
      .createRecord('user', userSchema)
      .save()
      .then(() => {
        this.get('session')
        .authenticate('authenticator:devise', email, password)
        .catch(e => {
          this.set('errorMessage', 'Account was created, but cannot be logged in at this time.');
        });
      })
      .catch(e => {
        this.set('errorMessage', 'Not able to sign up at this time.');
      });
    }
    else {
      this.set('errorMessage', errorMessage);
    }
  }


  @action
  showLoginPanel() {
    this.sendAction('showLoginPanel');
  }

}
