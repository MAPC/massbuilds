import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import Route from '@ember/routing/route';


export default Route.extend({

  currentUser: service(),


  beforeModel() {
    const currentUser = this.get('currentUser.user');

    if (currentUser.get('role') !== 'admin')  {
      this.transitionTo('map.moderations.for.user', currentUser.get('id'));
    }
  },


  model() {
    return RSVP.resolve(this.get('store')
                            .query('edit', {
                              filter: {
                                approved: false
                              }
                            }))
              .then(edits => {
      return RSVP.hash({
        edits,
        developments: RSVP.all(edits.map(edit => edit.belongsTo('development').reload())),
      }).then(model => {
        return model.edits.sortBy('createdAt').reverse();
      });
    });
  },

});
