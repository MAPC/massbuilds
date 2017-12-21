import Component from '@ember/component';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Component {

  @service session


  @action 
  logout() {
    this.get('session').invalidate();
  }

}
