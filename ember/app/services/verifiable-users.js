import RSVP from 'rsvp';
import Service from '@ember/service';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Service {

  @service ajax
  @service currentUser
  @service store

  constructor() {
    super(...arguments);

    this._count = null;
  }


  @computed('currentUser.user.role')
  get updater() {
    if (this.get('currentUser.user.role') === 'admin') {

      RSVP.resolve(this.get('store')
          .query('user', { request_verified_status: true }))
          .then(res => this.set('_count', res.toArray().length));
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
