import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Component {

  @service session
  @service currentUser


  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'account-subpanel']
  }


  @computed('currentUser.user.role') 
  get verified() {
    const userRole = this.get('currentUser.user.role');
    const verifiedRoles = ['admin', 'municipal', 'verified'];

    console.log(userRole);

    return verifiedRoles.indexOf(userRole) !== -1;
  }


  @action 
  logout() {
    this.get('session').invalidate();
  }

}
