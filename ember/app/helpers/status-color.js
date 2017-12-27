import { helper } from '@ember/component/helper';
import statusColors from 'massbuilds/utils/status-colors';


export function statusColor(params) {
  console.log(params[0]);
  return statusColors[params[0]] || 'grey';
}

export default helper(statusColor);
