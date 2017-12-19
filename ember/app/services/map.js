import Service from '@ember/service';
import L from 'npm:leaflet';
import { computed, action } from 'ember-decorators/object';

export const massLng = -71.525258;
export const massLat = 42.177117;

export default class extends Service {

  constructor() {
    super();

    this.lower = {lat: 41.258856, lng: -72.7496044};
    this.upper = {lat: 42.869699, lng: -70.0528674};

    this.instance = null;
    this.data = [];
  }

  @computed('data', 'lat', 'lng')
  get bounds() {
    const data = this.get('data');
    console.log(data.length);
    let latLngs = [];

    if (data.get('length') > 0) {
      latLngs = data.map(datum => L.latLng([datum.get('latitude'), datum.get('longitude')]));
    }
    else {
      latLngs = [this.get('lower'), this.get('upper')];
    }

    return L.latLngBounds(latLngs);
  }
    
} 
