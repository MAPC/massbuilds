import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import statusColors from 'massbuilds/utils/status-colors';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'map-legend'];
    this.classNameBindings = ['showing'];

    this.statusColors = statusColors;
  }


}
