import Ember from 'ember';
import Service from '@ember/service';
import { action } from 'ember-decorators/object';


export default class extends Service {

  constructor() {
    super(...arguments);

    this.message = null;
    this.mode = null;
    this.timer = null;
  }


  @action
  show(message, opts = {}) {
    this.set('message', message);
    this.set('mode', opts.mode || null);

    Ember.run.cancel(this.get('timer'));
    this.timer = Ember.run.later(this, () => this.set('message', null), opts.duration || 5000);
  }

};
