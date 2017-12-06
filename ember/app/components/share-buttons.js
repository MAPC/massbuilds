import Component from '@ember/component';
import { action } from 'ember-decorators/object';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'share-buttons'];
    this.isOpen = false;
  }

  @action
  toggleOpen() {
    this.toggleProperty('isOpen');
  }

}
