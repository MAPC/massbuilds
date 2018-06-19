import Ember from 'ember';
import Service from '@ember/service';
import mapboxgl from 'npm:mapbox-gl';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export const massLng = -71.525258;
export const massLat = 42.177117;


export default class extends Service {

  @service store
  @service notifications


  constructor() {
    super();

    this.lower = {lat: 41.258856, lng: -72.7496044};
    this.upper = {lat: 42.869699, lng: -70.0528674};
    this.pad = 0;

    this.instance = null;
    this.viewing = null;
    this.filteredData = [];

    this.boundsUpdater = 0;

    this.stored = [];
    this.storedBounds = null;

    this.get('store').query('development', { trunc: true }).then(results => {
      this.set('stored', results.toArray());
      this.set('storedBounds', mapboxgl.LngLatBounds.convert(results.map(result => new mapboxgl.LngLat(result.get('longitude'), result.get('latitude')))));
    });
  }


  @computed('stored.length', 'filteredData.length', 'viewing', 'boundsUpdater')
  get bounds() {
    const viewing = this.get('viewing');
    let data = [];
    let mod = 0;

    if (viewing) {
      data = [viewing];
      mod = -.0024;
    }
    else {
      const dataSource = (this.get('filteredData.length') > 0) ? 'filteredData' : 'stored';
      data = this.get(dataSource);
    }

    const storedBounds = this.get('storedBounds');

    if (data.get('length') === this.get('stored.length') && storedBounds != null) {
      return storedBounds;
    }

    let latLngs = [];
    if (data.get('length') > 0) {
      latLngs = data.map(datum => new mapboxgl.LngLat(datum.get('longitude') + mod, datum.get('latitude')));
    }
    else {
      latLngs = [this.get('lower'), this.get('upper')];
    }

    const bounds = mapboxgl.LngLatBounds.convert(latLngs);

    return bounds;
  }


  returnToPoint() {
    this.set('boundsUpdater', Math.random());
  }


  filterByQuery(query) {
    if (Object.keys(query.filter).length === 0) {
      this.set('pad', 0);
      this.set('filteredData', []);
    }
    else {
      this.get('notifications').show('Updating map', { duration: 2000 });

      this.set('pad', .1);
      this.get('store')
          .query('development', query)
          .then(result => {
            this.set('filteredData', result);
          });
    }
  }

  @computed('stored', 'filteredData')
  get remainder() {
    const filtered = this.get('filteredData').reduce((obj, datum) =>
      Object.assign(obj, { [datum.get('id')]: true })
    , {});
    return this.get('stored').filter((datum) => !filtered[datum.get('id')]);
  }

  remove(development) {
    this.get('stored').removeObject(development);
  }

  add(development) {
    this.get('stored').pushObject(development);
  }

}
