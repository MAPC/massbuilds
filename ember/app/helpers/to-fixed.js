import { helper } from '@ember/component/helper';

export function toFixed(params/*, hash*/) {
  const [number, decimalPlaces] = params;
  if (number && decimalPlaces > -1) {
    return number.toFixed(decimalPlaces);
  }
  return '';
}

export default helper(toFixed);
