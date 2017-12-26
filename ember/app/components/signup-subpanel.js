import Component from '@ember/component';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Component {

  @service session


  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'signup-subpanel'];

    this.username = '';
    this.password = '';
  }


  @action
  signup() {
     
  }


  @action
  showLoginPanel() {
    this.sendAction('showLoginPanel');
  }

}
