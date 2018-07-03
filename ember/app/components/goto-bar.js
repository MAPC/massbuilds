import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import filters from 'massbuilds/utils/filters';


export default class extends Component {

  @service ajax

  constructor() {
    super();
    this.classNames = ['component', 'goto-bar'];
  }

  @computed('searchQuery')
  get searchList() {
    const searchQuery = this.get('searchQuery').toLowerCase().trim();

    this.get('ajax').request(`http://pelias.mapc.org/v1/search?text=${searchQuery}`
        + `&boundary.country=USA&boundary.rect.min_lon=-73.5081481933594`
        + `&boundary.rect.max_lon=-69.8615341186523`
        + `&boundary.rect.min_lat=41.1863288879395`
        + `&boundary.rect.max_lat=42.8867149353027`, {
      accept: 'application/json',
    })
    .then((resp) => {
      console.log(resp);
    });

    return filtered;
  }


  @computed('searchList')
  get searchListCount() {
    const searchList = this.get('searchList');
    return searchList.length;
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
  clearSearch() {
    this.set('searchQuery', '');
  }

}
