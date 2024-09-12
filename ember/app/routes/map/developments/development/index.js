import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';

export default class extends Route {

  @service map

  activate(transition) { // eslint-disable-line
    this.get('map').set('showingLeftPanel', true);
  }
}
