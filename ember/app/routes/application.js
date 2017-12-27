import Ember from 'ember';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {

  currentUser: Ember.inject.service(),


  beforeModel() {
    return this._loadCurrentUser();
  },


  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },


  _loadCurrentUser() {
    return this.get('currentUser').load().catch((e) => {
      console.log(e);
      //this.get('session').invalidate()
    });
  }


});
