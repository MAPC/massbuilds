import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';


export default class extends Route {

  @service map
  @service currentUser


  beforeModel({ params }) {
    const currentUser = this.get('currentUser.user');

    if (currentUser) {
      if (currentUser.get('id') !== params['map.developments.for.user'].user_id) {
        this.transitionTo('map.developments.for.user', currentUser);
      }
    }
    else {
      this.transitionTo('map');
    }
  }


  model({ user_id }) {
    return this.get('store').findRecord('user', user_id).then(user => {
      return user.hasMany('developments').reload();
    });
  }


  afterModel(model) {
    console.log(model);
    if (model.get('length') > 0) {
      this.get('map').set('data', model);
    }
  }

}
