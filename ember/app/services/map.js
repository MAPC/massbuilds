import Service from '@ember/service';
import { action } from 'ember-decorators/object';

export const bostonLng = -71.525258;
export const bostonLat = 42.177117;

export default class extends Service {

  constructor() {
    super();

    this.lat = bostonLat;
    this.lng = bostonLng; 
    this.zoom = 9;

    this.data = [];
  }


  @action
  reset() {
    this.set('lat', bostonLat);
    this.set('lng', bostonLng); 
    this.set('zoom', 0);
  }
    
} 
