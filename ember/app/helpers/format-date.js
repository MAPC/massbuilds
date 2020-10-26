import { helper } from '@ember/component/helper';

export function formatDate(dateString, format) {
  // How is the date arriving into the function? (what format)
  // format-date model.updatedAt format='MMM. Do YYYY'
  // format-date user.createdAt format='MM/DD/YY'

  return dateString;
}

export default helper(formatDate);
