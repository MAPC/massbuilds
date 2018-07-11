import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';


export default class extends Controller {


  @computed('model.[]')
  get developments() {
    return this.get('model').sortBy('createdAt').reverse();
  }


}
