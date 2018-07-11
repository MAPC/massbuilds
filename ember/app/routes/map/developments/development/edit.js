import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class extends Route.extend(AuthenticatedRouteMixin) {

  @service map

  activate(transition) {
    this.get('map').setSelectionMode(true);
  }

  deactivate(transition) {
    this.get('map').setSelectionMode(false);
  }
}
