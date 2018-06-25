import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import { alias } from 'ember-decorators/object/computed';
import content from './../content';

export default class extends Component.extend({
  tagName: '',
}) {
  @service term
  @alias('term.openTerm') openTerm
  constructor() {
    super(...arguments);
    const term = content.TERMS[this.key];
    if (term) {
      this.label = term.label; // String label
      this.definition = term.definition; // Array of paragraphs
      this.unitsShort = term.unitsShort;
    } else {
      this.label = this.key || 'Undefined';
      this.definition = 'This term is not defined';
    }
    this.orientation = 'top-left';
  }

  @action
  showDefinition() {
    this.set('term.openTerm', this.get('key'));
  }

};
