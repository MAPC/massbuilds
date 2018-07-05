import Component from '@ember/component';
import DS from 'ember-data';
import { action, computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import filters from 'massbuilds/utils/filters';


export default class extends Component {

  @service map
  @service ajax

  constructor() {
    super();
    this.classNames = ['component', 'search-bar', 'goto-bar'];
    this.loading = false;
  }

  @computed('searchQuery')
  get searchList() {
    const searchQuery = this.get('searchQuery').toLowerCase().trim();
    if (searchQuery.length == 0) { return []; }

    this.set('loading', true);
    return DS.PromiseArray.create({
      promise: this.get('ajax').request(`http://pelias.mapc.org/v1/search?text=${searchQuery}`
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


  @action
  goto(geometry) {
    this.set('searchQuery', '');
    this.get('map').set('jumpToSelectedCoordinates', true);
    this.get('map').set('selectedCoordinates', geometry.coordinates);
  }


  @action
  clearSearch() {
    this.set('searchQuery', '');
  }

}
