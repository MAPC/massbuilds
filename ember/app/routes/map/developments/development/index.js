import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';

export default class extends Route {

  @service map

  activate(transition) {
    this.get('map').set('showingLeftPanel', true);
  }
}
