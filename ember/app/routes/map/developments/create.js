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
    this.get('map').setSelectionMode(true);
  }
  @action
  deactivate(transition) {
    this.get('map').setSelectionMode(false);
  }

};
