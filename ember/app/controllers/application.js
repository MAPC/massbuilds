import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default class extends Controller {

  @service session


  @action 
  invalidateSession() {
    this.get('session').invalidate();
  }

}
