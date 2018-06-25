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
  @alias('term.element') termLabelElement

  constructor() {
    super(...arguments);
    this.windowWidth = 0;
    this.windowHeight = 0;
  }

  didInsertElement() {
    this.set('windowWidth', Ember.$(window).width());
    this.set('windowHeight', Ember.$(window).height());
    Ember.$(window).resize(() => {
      this.set('windowWidth', Ember.$(window).width());
      this.set('windowHeight', Ember.$(window).height());
    });
  }

  @computed('openTerm', 'termLabelElement')
  get rect() {
    const element = this.get('termLabelElement');
    if (!element) { return null; }
    return element.getBoundingClientRect();
  }

  @computed('rect', 'windowWidth', 'windowHeight')
  get orientation() {
    if (!this.get('rect')) { return 'top-left'; }
    const midWidth = this.get('windowWidth') / 2;
    const midHeight = this.get('windowHeight') / 2;
    const rect = this.get('rect');
    if (rect.top > midHeight && rect.left < midWidth) {
      return 'bottom-left';
    }
    return 'top-left';
  }

  @computed('openTerm')
  get label() {
    if (!this.get('openTerm')) {
      return '';
    }
    return content.TERMS[this.get('openTerm')].label;
  }

  @computed('openTerm')
  get definition() {
    if (!this.get('openTerm')) { return ''; }
    return content.TERMS[this.get('openTerm')].definition;
  }

  @computed('openTerm')
  get unitsShort() {
    if (!this.get('openTerm')) { return ''; }
    return content.TERMS[this.get('openTerm')].unitsShort;
  }

  @computed('rect', 'orientation')
  get top() {
    const rect = this.get('rect');
    const orientation = this.get('orientation');
    if (!rect) { return '0'; }

    if (orientation == 'top-left') {
      return `${rect.top + rect.height - 16}px`;
    }
    return 'auto';
  }

  @computed('rect', 'orientation')
  get bottom() {
    const rect = this.get('rect');
    const orientation = this.get('orientation');
    const windowHeight = this.get('windowHeight');
    if (!rect) { return '0'; }

    if (orientation == 'bottom-left') {
      return `${windowHeight - rect.bottom - 16}px`;
    }
    return 'auto';
  }

  @computed('rect', 'orientation')
  get left() {
    const rect = this.get('rect');
    const orientation = this.get('orientation');
    if (!rect) { return '0'; }
    return `${rect.left + rect.width + 12}px`;
  }

  @action
  catchClick() {
    this.set('term.openTerm', null);
  }
};
