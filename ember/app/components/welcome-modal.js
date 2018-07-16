import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default class extends Component {

  @service cookies
  constructor() {
    super();
    this.classNameBindings = ['getClassNames'];
    this.active = !this.get('cookies').read()['dismissed_welcome'];
  }

  @computed('active')
  getClassNames() {
    return this.get('active')
        ? 'component welcome-modal active'
        : 'component welcome-modal';
  }

  @action
  dismissWelcome() {
    this.get('cookies').write('dismissed_welcome', true);
    this.set('active', false);
  }

}
