import Ember from 'ember';
import Service from '@ember/service';
import { action } from 'ember-decorators/object';


export default class extends Service {

  constructor() {
    super(...arguments);
    this.openDefinition = null;
  }

  @action
  catchClick() {
    console.log('catch')
    this.set('openDefinition', null);
  }
}
