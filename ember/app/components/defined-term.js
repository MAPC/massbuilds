import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';
import content from './../content';

export default class extends Component.extend({
  tagName: '',
}) {
  @service definition
  @alias('definition.openDefinition') openDefinition
  constructor() {
    super();
    const term = content.TERMS[this.key];
    if (term) {
      this.label = term.label; // String label
      this.definition = term.definition; // Array of paragraphs
    } else {
      this.label = this.key || 'Undefined';
      this.definition = 'This term is not defined';
    }
  }

  @action
  showDefinition() {
    this.set('definition.openDefinition', this.get('key'));
    console.log(this.get('definition.openDefinition'));
  }
};
