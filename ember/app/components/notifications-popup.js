import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';


export default class extends Component {

  @service notifications


  constructor() {
    super(...arguments);

    this.classNames = ['component', 'notifications-popup'];
  }


  @computed('notifications.message')
  get active() {
    return this.get('notifications.message');
  }


  @computed('notifications.message')
  get message() {
    const message = this.get('notifications.message');

    if (message) {
      this.set('lastMessage', message);
    }

    return message || this.get('lastMessage');
  }

}
