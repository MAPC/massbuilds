import RSVP from 'rsvp';
import Route from '@ember/routing/route';


export default Route.extend({

  currentUser: Ember.inject.service(),


  beforeModel() {
    const currentUser = this.get('currentUser.user');

    if (currentUser.get('role') !== 'admin')  {
      this.transitionTo('map.moderations.for.user', currentUser);
    }
  },


  model() {
    return RSVP.resolve(this.get('store').findAll('edit')).then(edits => {
      return RSVP.hash({
        edits,
        developments: RSVP.all(edits.mapBy('development')),
      }).then(model => {
        return model.edits;
      });
    });
  },


  afterModel(model) {
    console.log(model);
  }


});
