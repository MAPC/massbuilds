import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';


export default Route.extend(ApplicationRouteMixin, {

  currentUser: service(),


  beforeModel() {
    return this._loadCurrentUser();
  },

  afterModel() {
    this.get('currentUser')
        .set('alreadyLoggedIn', !!this.get('session.data.authenticated.email'));
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },


  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => {
      this.get('session').invalidate();
    });
  }


});
