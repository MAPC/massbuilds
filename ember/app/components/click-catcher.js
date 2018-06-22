import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';
import { action, computed } from 'ember-decorators/object';

export default class extends Component {
  @service definition

  @computed('definition.openDefinition')
  get active() {
    console.log(this.get('definition.openDefinition'))
    return !!this.get('definition.openDefinition');
  }

};
