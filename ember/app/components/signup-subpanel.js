import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import munis from '../utils/municipalities';


export default class extends Component {

  @service session
  @service store
  @service ajax


  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'form-subpanel', 'signup-subpanel'];

    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.password = '';
    this.municipality = null;
    this.confirmPassword = '';

    this.errorMessage = null;

    this.munis = [];
    this.isFetching = false;
    this.muniFailure = false;
    this.requesting = null;
  }


  @action
  fetchMunis() {
    this.set('munis', munis.map(row => row.text).sort());
  }


  @action
  updateMunicipality(muni) {
    this.set('municipality', muni);
  }


  @computed('fullName', 'username', 'password', 'confirmPassword')
  get submittable() {
    return [
      'firstName',
      'lastName',
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
    const { firstName, lastName } = this.getProperties('firstName', 'lastName');
    const { password, confirmPassword } = this.getProperties('password', 'confirmPassword');
    const requesting = this.get('requesting');
    const municipality = requesting == 'municipal'
        ? this.get('municipality')
        : (requesting == 'state' ? 'STATE' : null);
    const requestVerifiedStatus = !!requesting;


    /**
     * Validations
     */

    if (!email) {
      noErrors = false;
    }

    if (firstName && lastName) {
      const nameRegex = /^[A-Za-z\-']+$/;

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
      const userSchema = { firstName, lastName, email, password, municipality, requestVerifiedStatus };

      this.set('loadingText', 'Signing Up');
      this.set('isCreating', true);

      this.get('store')
      .createRecord('user', userSchema)
      .save()
      .then(() => {
        this.set('loadingText', 'Logging In')

        this.get('session')
        .authenticate('authenticator:devise', email, password)
        .catch(() => {
          this.set('errorMessage', 'Account was created, but cannot be logged in at this time.');
        })
        .finally(() => {
          this.set('isCreating', false);
        });
      })
      .catch(() => {
        this.set('isCreating', false);
        this.set('errorMessage', 'Not able to sign up at this time.');
      });
    }
    else {
      this.set('errorMessage', errorMessage);
    }
  }

}
