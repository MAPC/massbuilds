import { cancel, later } from '@ember/runloop';
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

    cancel(this.get('timer'));
    this.timer = later(this, () => this.set('message', null), opts.duration || 5000);
  }

  error(message) {
    this.show(message, { mode: 'error' });
  }

}
