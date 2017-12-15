import Component from '@ember/component';
import { computed, action } from 'ember-decorators/object';
import filters, { metricGroups } from 'massbuilds/utils/filters';


export default class extends Component {

  constructor() {
    super();
  }


  @computed('viewing.name', 'activeFilters')
  get subgroups() {
    const subgroups = metricGroups[this.get('viewing.name')];
    const activeFilters = this.get('activeFilters');

    const temp = subgroups.map(subgroup => {
      return {
        title: subgroup.title,
        metrics: subgroup.metrics.map(metric => {
          let active = activeFilters.filter(x => x.col === metric)[0];
           
          return active || filters[metric];
        }),
      };
    });

    return temp;
  }

}
