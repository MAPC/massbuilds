import Service from '@ember/service';
import { action } from 'ember-decorators/object';


export default class extends Service {

  constructor() {
    super(...arguments);

    this.message = 'This is a message for coding purposes';
    this.mode = null;
    this.tick = null;
  }


  @action
  show(message, mode) {
    this.set('message', message);
    this.set('mode', mode || null);

    this.set('tick', Math.random());
  }

};
