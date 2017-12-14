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


  /**
   * We need to allow arrays in the query parameters
   * for the discrete filters.
   */
  serializeQueryParam(value, urlKey, defaultValueType) {
    if (defaultValueType === 'array') {
      return value;
    }
    
    return '' + value; 
  }

  deserializeQueryParam(value, urlKey, defaultValueType) {
    if (defaultValueType === 'array' && typeof value === 'string') {
      return value.split(',');
    }

    return value; 
  }

}
