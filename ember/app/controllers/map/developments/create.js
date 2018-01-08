import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';


export default class extends Controller {

  @action 
  createDevelopment() {
    this.get('model').save().then(development => {
      this.transitionToRoute('map.developments.development', development);
    });
  }

}
