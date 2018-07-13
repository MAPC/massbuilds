import Route from '@ember/routing/route';
import { service } from 'ember-decorators/service';
import { action } from 'ember-decorators/object';

export default class extends Route {

  @service map

  model() {
    return this.get('store').createRecord('development');
  }

  @action
  activate(transition) {
    this.get('map').set('showingLeftPanel', true);
    this.get('map').set('markerVisible', true);
    this.get('map').set('followMode', true);
  }

  @action
  deactivate(transition) {
    this.get('map').set('followMode', false);
    this.get('map').set('markerVisible', false);
  }

};
