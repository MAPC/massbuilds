import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';
import Development from 'massbuilds/models/development';
import castToModel from 'massbuilds/utils/cast-to-model';


export default class extends Controller {

  @action 
  createDevelopment(data) {
    const model = this.get('model');

    data = castToModel(Development, data);

    Object.keys(data).forEach(attr => model.set(attr, data[attr]));

    model.save().then(development => {
      this.transitionToRoute('map.developments.development', development);
    });
  }

}
