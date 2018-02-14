import { helper } from '@ember/component/helper';
import statusColors from 'massbuilds/utils/status-colors';


export function statusColor(params) {
  return statusColors[params[0]] || 'grey';
}

export default helper(statusColor);
