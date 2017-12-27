import Component from '@ember/component';
import statusColors from 'massbuilds/utils/status-colors';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'map-legend'];

    this.statusColors = statusColors;
  }

}
