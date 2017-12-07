import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import { gt } from 'ember-decorators/object/computed';
//import filters from 'massbuilds/utils/filters';


export default class extends Controller {

  @service map

  constructor() {
    super();

    this.searchPlaceholder = 'Search by Town/City, Developer, Address...';

    this.showingFilters = false;
    this.activeFilters = [];
  }


  @gt('activeFilters', 0) filtering

  @action
  toggleFilters() {
    this.toggleProperty('showingFilters');
  }


  @action
  clearFilters() {
    this.set('activeFilters', []);
  }

}
