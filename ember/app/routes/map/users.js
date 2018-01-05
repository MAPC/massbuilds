import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Route.extend(AuthenticatedRouteMixin, { 

  currentUser: Ember.inject.service(),


  beforeModel() {
    if (this.get('currentUser.user.role') !== 'admin')  {
      this.transitionTo('map');
    }
  },


  model() {
    return this.get('store').findAll('user');
  },


});
