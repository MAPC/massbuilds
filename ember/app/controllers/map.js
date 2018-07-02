import Ember from 'ember';
import Controller from '@ember/controller';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import filters from 'massbuilds/utils/filters';
import { alias } from 'ember-decorators/object/computed';

export default class extends Controller {

  @service map
  @service currentUser
  @alias('map.baseMap') baseMap

  constructor() {
    super(...arguments);

    const filterParams = Object.keys(filters);
    const otherParams = ['panel'];

    this.queryParams = [...filterParams, ...otherParams];

    Object.values(filters).forEach(filter => {
      if (filter.filter === 'discrete') {
        this.set(filter.col, []);
      }
    });

    this.searchPlaceholder = 'Search by Town/City, Developer, Address...';
    this.searchQuery = '';

    this.showingFilters = false;
    this.showingMenu = false;
    this.get('currentUser').addObserver('alreadyLoggedIn', this, () => {
      if (!this.get('currentUser.alreadyLoggedIn')) {
        this.set('showingMenu', true);
      }
    });

    this.updateChildren = 0;
    this.panel = null;
    this.leftPanelWidth = 'filter-width';
  }


  @computed('target.currentRouteName')
  get showingUsers() {
    return [
      'map.users.index',
      'map.users.verify',
    ].indexOf(this.get('target.currentRouteName')) !== -1;
  }


  @computed('target.currentRouteName')
  get showingModerations() {
    return [
      'map.moderations.index',
      'map.moderations.for.user',
    ].indexOf(this.get('target.currentRouteName')) !== -1;
  }


  @computed('target.currentRouteName')
  get showingDevelopment() {
    return [
      'map.developments.development.index',
      'map.developments.development.edit',
      'map.developments.create',
      'map.developments.for.user',
    ].indexOf(this.get('target.currentRouteName')) !== -1;
  }


  @computed('updateChildren')
  get activeFilters() {
    return Object.keys(filters).map(col => {
        let value = this.get(col);
        let found = null;

        if (value) {
          if (
            typeof value !== 'object'  // not object/array
            || value.length > 0        // if array, then make sure it has elements
          ) {
            found = Ember.copy(filters[col]);

            if (found.filter === 'metric') {
              if (found.type === 'number') {
                const metricParts = value.split(';');

                Ember.set(found, 'inflector', metricParts[0]);
                Ember.set(found, 'value', metricParts[1]);
              }
              else if (found.type === 'boolean') {
                Ember.set(found, 'value', value == 'true');
              }
            }
            else {
              Ember.set(found, 'value', value);
            }
          }
        }
        else {
          Ember.set(filters[col], 'value', null);
        }

        return found;
      }).filter(x => x !== null);
  }


  @computed('activeFilters.length')
  get filtering() {
    const filtering = this.get('activeFilters.length') > 0;

    return filtering;
  }


  @computed('showingFilters', 'showingDevelopment', 'showingUsers', 'showingModerations')
  get showingLeftPanel() {
    const showing = (
      this.get('showingFilters')
      || this.get('showingDevelopment')
      || this.get('showingUsers')
      || this.get('showingModerations')
    );

    this.set('searchQuery', '');

    return showing;
  }

  @computed('showingLeftPanel')
  get leftPanelClass() {
    if (this.get('showingLeftPanel')) {
      const widthClass = this.get('showingFilters')
          ? 'filter-width'
          : 'development-width';
      this.set('leftPanelWidth', widthClass)
      return widthClass;
    }
    return this.get('leftPanelWidth');
  }

  @action
  setBaseMap(baseMap) {
    this.set('map.baseMap', baseMap);
  }

  @action
  setZoomCommand(cmd) {
    // Zoom commands include: ['IN', 'OUT']
    this.get('map').set('zoomCommand', cmd);
  }

  @action
  toggleMenu() {
    this.toggleProperty('showingMenu');
  }


  @action
  toggleFilters() {
    this.toggleProperty('showingFilters');
  }


  @action
  hideFilters() {
    this.set('showingFilters', false);
  }


  @action
  clearFilters() {
    Object.values(filters).forEach(filter => {
      if (filter.filter === 'discrete') {
        this.set(filter.col, []);
      }
      else {
        this.set(filter.col, undefined);
      }
    });

    this.set('updateChildren', Math.random());
    this.get('target').send('refreshModel');
  }


  @action
  updateFilter(updateValues) {
    Object.keys(updateValues).forEach(col => {
      let filter = updateValues[col];
      let value = filter;

      if (filter.filter === 'metric') {
        switch(filter.type) {
          case 'number':
            value = (filter.value) ? `${filter.inflector};${filter.value}` : undefined;
            break;
          case 'boolean':
            value = (filter.value) ? true : undefined;
            break;
          default:
            value = filter.value;
        }
      }

      this.set(col, value);
    });

    this.set('updateChildren', Math.random());
    this.get('target').send('refreshModel');
  }


  @action
  addDiscreteFilter(selected) {
    const filter = { [selected.col]: [selected.value] };

    const active = this.get('activeFilters')
                       .filter(active => active.name === selected.name)[0];

    if (active) {
      filter[selected.col] = [ ...filter[selected.col], ...active.value].uniq();
    }

    this.updateFilter(filter);
  }


  @action
  viewDevelopment(id) {
    this.set('showingFilters', false);
    this.get('map').setFocusedDevelopment(id);
    this.transitionToRoute('map.developments.development', id);
  }


  @action
  setMapInstance(map) {
    this.set('map.instance', map.target);
  }


  @action
  showLoginForm() {
    this.transitionToRoute('map', { queryParams: { panel: null } });
  }

}
