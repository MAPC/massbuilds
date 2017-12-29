import Controller from '@ember/controller';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Controller {

  @service map

  constructor() {
    super();
  }

}
