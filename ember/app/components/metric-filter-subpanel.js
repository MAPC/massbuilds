import Component from '@ember/component';
import { computed, action } from 'ember-decorators/object';
import { metricGroups } from 'massbuilds/utils/filters';


export default class extends Component {

  constructor() {
    super();
    console.log(this.get('subgroups'));
  }

  @computed('viewing.name')
  get subgroups() {
    return metricGroups[this.get('viewing.name')];
  }

}
