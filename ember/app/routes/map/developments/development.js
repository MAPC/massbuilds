import Route from '@ember/routing/route';

export default class extends Route {

  model(params) {
    return this.store.findRecord('development', params.development_id);
  }

  afterModel(model) {
    console.log(model) ;
  }

}
