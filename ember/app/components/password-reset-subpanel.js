import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';

export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'password-reset-subpanel', 'signup-subpanel'];

    this.username = '';
  }

  @computed('username')
  get submittable() {
    return (this.get('username') !== '');
  }

  @action
  resetPassword() {
    if (this.get('submittable')) {
    
    }
  }

}
