import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';


export default class extends Route {

  @service currentUser


  beforeModel() {
    const currentUser = this.get('currentUser.user');

    if (currentUser) {
      this.transitionTo('map.developments.for.user', currentUser);
    }
    else {
      this.transitionTo('map');
    }
  }

}
