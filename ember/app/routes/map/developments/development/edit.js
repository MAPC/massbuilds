import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class extends Route.extend(AuthenticatedRouteMixin) {

  @service map

  activate(transition) {
    this.get('map').set('showingLeftPanel', true);
    this.get('map').set('markerVisible', true);
    this.get('map').set('followMode', true);
  }

  deactivate(transition) {
    this.get('map').set('followMode', false);
    this.get('map').set('markerVisible', false);
  }
}
