import Ember from 'ember';
import Service from '@ember/service';
import { service } from 'ember-decorators/service';

const { RSVP, isEmpty } = Ember;


export default class extends Service {

  @service session
  @service store


  load() {
    console.log(this.get('session'));
    const email = this.get('session.data.authenticated.email');

    if (!isEmpty(email)) {
      return this.get('store').queryRecord('user', { email }).then(user => {
        console.log(user);
        this.set('user', user);
      });
    }
    else {
      return RSVP.resolve();
    }
  }

}
