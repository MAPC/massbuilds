import Controller from '@ember/controller';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import { gt } from 'ember-decorators/object/computed';
import filters from 'massbuilds/utils/filters';


export default class extends Controller {

  @service map

  constructor() {
    super();

    this.queryParams = ['filterBy']
    this.filterBy = {};

    this.searchPlaceholder = 'Search by Town/City, Developer, Address...';

    this.showingFilters = true;
    this.showingMenu = false;
  }

  @computed('filterBy')
  get activeFilters() {
    const filter = JSON.parse(this.get('filterBy'));

    return Object.keys(filter).map(filterTitle => {
      let found = filters[filterTitle];
      found.value = filter[filterTitle];

      return found;
    });
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
    this.set('activeFilters', []);
  }

}
