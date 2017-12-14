import { helper } from '@ember/component/helper';

export function capitalize(params) {
  const input = params[0] || '';

  return input.split(' ')
              .map(x => x.capitalize())
              .join(' ');
}

export default helper(capitalize);
