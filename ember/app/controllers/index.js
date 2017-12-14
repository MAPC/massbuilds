import Controller from '@ember/controller';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import { gt } from 'ember-decorators/object/computed';
import filters from 'massbuilds/utils/filters';


export default class extends Controller {

  @service map

  constructor() {
    super();

    this.queryParams = Object.keys(filters);
    Object.values(filters).forEach(filter => {
      if (filter.filter === 'discrete') {
        this.set(filter.col, []);
      }
    });

    this.searchPlaceholder = 'Search by Town/City, Developer, Address...';

    this.showingFilters = true;
    this.showingMenu = false;
  }


  get activeFilters() {
    return Object.keys(filters).map(col => {
        let value = this.get(col);
        let found = null;

        if (value) {
          if (
            typeof value !== 'object'  // not object/array
            || value.length > 0        // if array, then make sure it has elements
          ) {
            found = filters[col]; 
            found.value = value;
          }
        }

        return found;
      }).filter(x => x !== null);
  }


  @gt('activeFilters', 0) filtering


  @computed('showingFilters')
  get showingLeftPanel() {
    const showingFilters = this.get('showingFilters');

    return showingFilters;
  }


  @computed('showingMenu')
  get showingRightPanel() {
    const showingMenu = this.get('showingMenu');

    return showingMenu;
  }


  @action
  toggleFilters() {
    this.toggleProperty('showingFilters');
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
  }

 
  @action
  updateFilter(updateValues) {
    Object.keys(updateValues).forEach(col => {
      this.set(col, updateValues[col]);
    });
  }

}
