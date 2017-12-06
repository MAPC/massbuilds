import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';

export default class extends Controller {

  @service map

  constructor() {
    super();

    this.searchPlaceholder = 'Search by Town/City, Developer, Address...'
  }
}
