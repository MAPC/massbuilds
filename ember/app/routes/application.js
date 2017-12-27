import Ember from 'ember';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { action } from 'ember-decorators/object';
import { filters, fromQueryParams } from 'massbuilds/utils/filters';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';



export default Route.extend(ApplicationRouteMixin, {

  currentUser: Ember.inject.service(),
  map: Ember.inject.service(),


  beforeModel() {
    return this._loadCurrentUser();
  },


  model(params) {
    const query = { trunc: true };

    if (params) {
      query['filter'] = fromQueryParams(this.getFilterParams(params));
    }

    this.get('map').filterByQuery(query);
  },


  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },


  /**
   * We need to allow arrays in the query parameters
   * for the discrete filters.
   */
  serializeQueryParam(value, urlKey, defaultValueType) {
    if (defaultValueType === 'array') {
      return value;
    }
    
    return '' + value; 
  },

  deserializeQueryParam(value, urlKey, defaultValueType) {
    if (defaultValueType === 'array' && typeof value === 'string') {
      return value.split(',');
    }

    return value; 
  },


  @action
  refreshModel() {
    this.refresh();
  },


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
  },


  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => {
      this.get('session').invalidate();
    });
  }


});
