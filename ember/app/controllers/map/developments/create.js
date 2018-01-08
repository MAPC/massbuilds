import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';


export default class extends Controller {

  @action 
  createDevelopment(data) {
    const model = this.get('model');

    Object.keys(data).forEach(attr => {
      model.set(attr, data[attr]);
    });

    model.save().then(development => {
      this.transitionToRoute('map.developments.development', development);
    });
  }

}
