import { htmlSafe } from '@ember/template';
import { helper } from '@ember/component/helper';

export function backgroundColor(params) {
  return new htmlSafe('background-color: ' + params[0]);
}

export default helper(backgroundColor);
