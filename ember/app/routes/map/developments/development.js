import Route from '@ember/routing/route';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Route {

  @service map


  model(params) {
    return this.store.findRecord('development', params.development_id);
  }


  afterModel(model) {
    this.set('data', model);
  }


  @action
  didTransition() {
    this.set('map.viewing', this.get('data'));
  }


  @action
  willTransition(transition) {
    if (transition.targetName.indexOf('map.developments.development') === -1) {
      this.set('map.viewing', null);
    }
  }

}
