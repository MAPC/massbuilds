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
    } else {
      this.label = this.key || 'Undefined';
    }
  }

  @action
  showDefinition(e) {
    this.set('term.element', e.target);
    this.set('term.openTerm', this.get('key'));
  }

};
