import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { service } from 'ember-decorators/service';

export default class extends Route {

  @service map

  model() {
    return hash({
      truncDevelopments: this.store.query('development', {trunc: true})
    });
  }

  afterModel(model) {
    this.get('map').set('data', model.truncDevelopments);
  }

}
