import RSVP from 'rsvp';
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


  model() {
    return RSVP.resolve(this.get('currentUser.user.edits')).then(edits => {
      return RSVP.hash({ 
        edits, 
        developments: RSVP.all(edits.map(edit => edit.belongsTo('development').reload())), // :face_with_rolling_eyes: update the development data
      }).then(model => {
        return model.edits.sortBy('createdAt').reverse(); 
      });
    });
  }

}
