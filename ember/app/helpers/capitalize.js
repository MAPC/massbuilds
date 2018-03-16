import { helper } from '@ember/component/helper';

export function capitalize(params) {
  let input = null;

  if (Array.isArray(params)) {
    input = params[0] || '';
  }
  else {
    input = params || '';
  }

  return input.split(/[\s\_]+/)
              .map(x => x.capitalize())
              .join(' ');
}

export default helper(capitalize);
