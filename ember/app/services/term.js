import Ember from 'ember';
import Service from '@ember/service';
import { computed } from 'ember-decorators/object';

export default class extends Service {

  constructor() {
    super(...arguments);
    this.openTerm = null;
  }
}
