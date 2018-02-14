import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';


export default class extends Route {

  @service currentUser


  beforeModel() {
    const currentUser = this.get('currentUser.user');

    if (currentUser) {
      this.transitionTo('map.moderations.for.user', currentUser);
    }
    else {
      this.transitionTo('map');
    }
  }

}
