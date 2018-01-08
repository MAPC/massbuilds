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
    return this.get('store').findAll('edit');
  },


});
