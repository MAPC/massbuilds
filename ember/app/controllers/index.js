import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import filters from 'massbuilds/utils/filters';


export default class extends Controller {

  @service map

  constructor() {
    super();

    this.searchPlaceholder = 'Search by Town/City, Developer, Address...';
    console.log(filters);

    this.showingFilters = false;
  }


  @action
  toggleFilters() {
    this.toggleProperty('showingProperties');
  }

}
