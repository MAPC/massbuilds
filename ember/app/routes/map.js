import Route from '@ember/routing/route';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import { filters, fromQueryParams } from 'massbuilds/utils/filters';


export default class extends Route {

  @service map
  @service notifications


  model(params) {
    const query = { trunc: true };

    if (params) {
      query['filter'] = fromQueryParams(this.getFilterParams(params));
      this.set('filterParams', query['filter']);
    }

    this.get('map').filterByQuery(query);
  }


  afterModel() {
    this.controllerFor('map').set('filterParams', this.get('filterParams'));
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


  setupController(controller, model) {
    this._super(controller, model);
    controller.set('filterParams', this.get('filterParams'));
  }


  @action
  refreshModel() {
    this.refresh();
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
