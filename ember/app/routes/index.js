import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { service } from 'ember-decorators/service';
import { filters, fromQueryParams } from 'massbuilds/utils/filters';


export default class extends Route {

  @service map

  model(params) {
    const query = { trunc: true };

    if (params) {
      query['filter'] = fromQueryParams(this.getFilterParams(params));
    }

    return hash({
      truncDevelopments: this.store.query('development', query)
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


  getFilterParams(params) {
    const setParams = {};

    Object.keys(params).forEach(key => {
      if (key in filters) {
       const value = params[key];

        if (
          value 
          && (!(value instanceof Array) || value.length > 0)) 
        {
          setParams[key] = value;
        }
      }
    });

    return setParams;
  }
}
