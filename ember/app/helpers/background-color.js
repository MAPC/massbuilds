import Ember from 'ember';
import { helper } from '@ember/component/helper';

export function backgroundColor(params) {
  return new Ember.String.htmlSafe('background-color: ' + params[0]);
}

export default helper(backgroundColor);
