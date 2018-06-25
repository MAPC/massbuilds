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
  }

  @action
  catchClick() {
    this.set('term.openTerm', null);
  }
};
