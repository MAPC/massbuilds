import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Component {

  @service session
  @service cookies
  @service currentUser


  constructor() {
    super();

    this.classNames = ['component', 'subpanel', 'account-subpanel']
    this.removedUpdater = 0;
  }


  @computed('currentUser.user.role') 
  get verified() {
    const userRole = this.get('currentUser.user.role');
    const verifiedRoles = ['admin', 'municipal', 'verified'];

    return verifiedRoles.indexOf(userRole) !== -1;
  }


  @computed('removedUpdater')
  get removedDenialMessage() {
    return this.get('cookies').read()['removed_muni_denial_message'];
  }


  @action 
  removeDenialMessage() {
    this.get('cookies').write('removed_muni_denial_message', true);
    this.set('removedUpdater', Math.random());
  }


  @action 
  logout() {
    this.get('session').invalidate();
  }


  @action
  closeMenu() {
    this.sendAction('hideFilters');
    this.sendAction('toggleMenu');
  }

}
