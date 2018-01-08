import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';


export default class extends Route {

  @service currentUser


  beforeModel({ params }) {
    const currentUser = this.get('currentUser.user');

    if (currentUser) {
      if (currentUser.get('id') !== params['map.moderations.for.user'].user_id) { 
        this.transitionTo('map.moderations.for.user', currentUser);
      }
    }
    else {
      this.transitionTo('map');
    }
  }


  model({ user_id }) {
    return this.get('store').findRecord('user', user_id).then(user => {
      return user.get('edits');
    });
  }

}
