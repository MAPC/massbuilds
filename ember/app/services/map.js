import Service from '@ember/service';
import L from 'npm:leaflet';
import { computed, action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export const massLng = -71.525258;
export const massLat = 42.177117;


export default class extends Service {

  @service store


  constructor() {
    super();

    this.lower = {lat: 41.258856, lng: -72.7496044};
    this.upper = {lat: 42.869699, lng: -70.0528674};
    this.pad = 0;

    this.instance = null;
    this.data = [];

    this.stored = [];
    this.storedBounds = null;

    this.get('store').query('development', { trunc: true }).then(results => {
      this.set('stored', results);
      this.set('storedBounds', L.latLngBounds(results.map(result => L.latLng([result.get('latitude'), result.get('longitude')]))));
    });
  }


  @computed('data')
  get bounds() {
    const data = this.get('data');
    const storedBounds = this.get('storedBounds');
    let latLngs = [];

    if (data.get('length') === this.get('stored.length') && storedBounds != null) {
      return storedBounds;
    }

    if (data.get('length') > 0) {
      latLngs = data.map(datum => L.latLng([datum.get('latitude'), datum.get('longitude')]));
    }
    else {
      latLngs = [this.get('lower'), this.get('upper')];
    }

    const bounds = L.latLngBounds(latLngs)
                    .pad(this.get('pad'));

    return bounds;
  }


  filterByQuery(query) {
    if (
      Object.keys(query.filter).length === 0
      && this.get('stored.length') > 0
    ) {
      this.set('pad', 0);
      this.set('data', this.get('stored'));
    }
    else {
      this.set('pad', .1);
      this.get('store')
          .query('development', query)
          .then(result => {
            console.log(result);
            this.set('data', result);
          });
    }
  }
    
} 
