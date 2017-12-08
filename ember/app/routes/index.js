import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.store.query('development', {trunc: true});
  },

  afterModel(model) {
    console.log(model);
  }

});
