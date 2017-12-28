import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('map', function() {
    this.route('developments', function() {
      this.route('development', { path: '/:development_id'});
    });
  });
});

export default Router;
