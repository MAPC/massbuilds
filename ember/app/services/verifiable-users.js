import RSVP from 'rsvp';
import Service from '@ember/service';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import config from 'massbuilds/config/environment';


export default class extends Service {

  @service ajax
  @service currentUser

  constructor() {
    super(...arguments);

    this._count = null;
  }


  @computed('currentUser.user.role')
  get updater() {
    if (this.get('currentUser.user.role') === 'admin') {
      const url = config.host + '/users?request_verified_status=true';

      RSVP.resolve(this.get('ajax').request(url))
          .then(res => this.set('_count', res.data.length));
    }
  }


  @computed('_count')
  get count() {
    this.get('updater');

    return this.get('_count');
  }


  decrementCount() {
    this.set('_count', this.get('_count') - 1);
  }

}
