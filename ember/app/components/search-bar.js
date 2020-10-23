import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import filters from 'massbuilds/utils/filters';


export default class extends Component {

  @service currentUser
  @service ajax
  @service map

  constructor() {
    super();

    this.classNames = ['component', 'search-bar'];
    this.sortOrder = ['municipal', 'nhood', 'devlper', 'name', 'address'];
    this.appCtrl = getOwner(this).lookup('controller:application');
    this.loading = false;
  }


  @reads('model') developments


  @computed('developments.[]')
  get municipal() {
    return this.uniqueValuesFor('municipal');
  }


  @computed('developments.[]')
  get devlper() {
    return this.uniqueValuesFor('devlper');
  }


  @computed('developments.[]')
  get nhood() {
    return this.uniqueValuesFor('nhood');
  }


  @computed('developments.[]')
  get name() {
    return this.valuesFor('name');
  }


  @computed('developments.[]')
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
    let filtered = {};
    if (searchQuery.length < 2) { return filtered; }
    const sortOrder = this.get('sortOrder');

    const queryWords = searchQuery.toLowerCase().split(' ');

    sortOrder.forEach(col => {
      var name = filters[col].name;

      filtered[name] = this.get(col)
        .filter(record => {
          var keywords = record.value.toLowerCase().split(' ');

          return (
            keywords
            ? queryWords.every(queryWord => (
              keywords.any(keyword => keyword.startsWith(queryWord))
            ))
            : false
          );
        })
        .map(row => ({ ...row, name, col }));
    });
    return filtered;
  }

  @computed('searchQuery')
  get gotoList() {
    const searchQuery = this.get('searchQuery').toLowerCase().trim();
    if (searchQuery.length <= 1) { return []; }

    this.set('loading', true);
    return DS.PromiseArray.create({
      promise: this.get('ajax').request(`https://pelias.mapc.org/v1/search?text=${searchQuery}`
          + `&boundary.country=USA&boundary.rect.min_lon=-73.5081481933594`
          + `&boundary.rect.max_lon=-69.8615341186523`
          + `&boundary.rect.min_lat=41.1863288879395`
          + `&boundary.rect.max_lat=42.8867149353027`)
      .then((resp) => {
        const items = resp.features.slice(0, 5).map((feature) => {
          return {
            label: feature.properties.label,
            type: feature.properties.layer.capitalize(),
            geometry: feature.geometry,
          };
        });
        this.set('loading', false);
        return items;
      }).catch(() => {
        this.set('loading', false);
        return [];
      })
    });
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

  @action
  goto(geometry) {
    this.set('searchQuery', '');
    this.get('map').set('markerVisible', true);
    this.get('map').set('jumpToSelectedCoordinates', true);
    this.get('map').set('selectedCoordinates', geometry.coordinates);
  }


  @action
  clearSearch() {
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
