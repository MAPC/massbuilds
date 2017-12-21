import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';
import filters from 'massbuilds/utils/filters';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'search-bar'];

    this.sortOrder = ['municipality', 'developerName', 'name', 'address'];
    this.searchQuery = '';
  }


  @reads('model') developments


  @computed('developments')
  get municipality() {
    return this.uniqueValuesFor('municipality');
  }


  @computed('developments')
  get developerName() {
    return this.uniqueValuesFor('developerName');
  }


  @computed('developments')
  get name() {
    return this.valuesFor('name');
  }


  @computed('developments')
  get address() {
    return this.valuesFor('address');
  }


  @computed('searchQuery')
  get searchList() {
    const searchQuery = this.get('searchQuery').toLowerCase().trim();
    const sortOrder = this.get('sortOrder');
    const developments = this.get('developments');
    const addressRegex =  /^\d{1,9}\w? (\w )?[a-zA-Z]+/i;
    let filtered = {};

    if (searchQuery.length >= 2) {
      if (addressRegex.test(searchQuery)) { 
      }

      sortOrder.forEach(col => {
        let name = filters[col].name;
        let filter = (col === 'name' || col === 'address') ? 'atomic' : 'discrete';

        filtered[name] = this.get(col)
                            .filter(value => value.toLowerCase().startsWith(searchQuery))
                            .map(value => {
                              return { value, name, filter }
                            });
      });
    }

    return filtered;
  }


  @computed('searchList') 
  get searching() {
    const searchList = this.get('searchList');

    return Object.keys(searchList).any(key => searchList[key].length > 0);
  }


  @action 
  selectItem(item) {
     
  }


  valuesFor(column) {
    return this.get('developments')
               .map(development => development.get(column))
               .filter(x => x !== null && x !== undefined)
               .sort();
  }


  uniqueValuesFor(column) {
    return this.get('developments')
               .map(development => development.get(column))
               .uniq()
               .filter(x => x !== null && x !== undefined)
               .sort();
  }
}
