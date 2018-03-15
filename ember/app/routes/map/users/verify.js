import Route from '@ember/routing/route';

export default class extends Route {

  model() {
    return this.get('store').query('user', { request_verified_status: true });
  }

}
