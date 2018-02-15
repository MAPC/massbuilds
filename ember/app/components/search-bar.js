import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import filters from 'massbuilds/utils/filters';


export default class extends Component {

  @service currentUser


  constructor() {
    super();

    this.classNames = ['component', 'search-bar'];

    this.sortOrder = ['municipal', 'nhood', 'devlper', 'name', 'address'];
    this.searchQuery = '';
  }


  @reads('model') developments


  @computed('developments')
  get municipal() {
    return this.uniqueValuesFor('municipal');
  }


  @computed('developments')
  get devlper() {
    return this.uniqueValuesFor('devlper');
  }


  @computed('developments')
  get nhood() {
    return this.uniqueValuesFor('nhood');
  }


  @computed('developments')
  get name() {
    return this.valuesFor('name');
  }


  @computed('developments')
  get address() {
    return this.valuesFor('address');
  }


  @computed('currentUser.user.role')
  get hasPermissions() {
    const role = this.get('currentUser.user.role');

    return role !== null && role !== undefined;
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

        filtered[name] = this.get(col)
                            .filter(row => row.value.toLowerCase().startsWith(searchQuery))
                            .map(row => {
                              return { ...row , name, col }
                            });
      });
    }

    return filtered;
  }


  @computed('searchList')
  get searchListCount() {
    const searchList = this.get('searchList');

    return Object.keys(searchList).reduce((a,key) => a + searchList[key].length, 0);
  }


  @computed('searchList') 
  get searching() {
    const searchList = this.get('searchList');

    return Object.keys(searchList).any(key => searchList[key].length >= 0);
  }


  @action 
  selectItem(item) {
    if (item) {
      if (item.id) {
        this.sendAction('viewDevelopment', item.id);
      }
      else {
        this.sendAction('addDiscreteFilter', item);
      }
    }

    this.set('searchQuery', '');
  }


  valuesFor(column) {
    return this.get('developments')
               .map(development => {
                 return { 
                  id: development.get('id'),
                  value: development.get(column),
                 };
                })
               .filter(x => x.value !== null && x.value !== undefined)
               .sortBy('value');
  }


  uniqueValuesFor(column) {
    return this.get('developments')
               .map(development => development.get(column))
               .uniq()
               .filter(x => x !== null && x !== undefined)
               .sort()
               .map(value => { return { value }; });
  }
}
