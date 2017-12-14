import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { metricGroups } from 'massbuilds/utils/filters';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'filter-panel'];

    this.viewing = this.get('filterGroups')[1];
  }

  @computed('activeFilters')
  get filterGroups() {
    const activeFilters = this.get('activeFilters');
    console.log(activeFilters);

    const discrete = ['Developer', 'Town/City'].map(name => {
                    
                        let active = activeFilters.any(filter => filter.name === name); 

                        return { name, active, type: 'discrete' };
                      });

    const metric = Object.keys(metricGroups).map(name => {
                      let active = metricGroups[name]
                                   .map(subgroup => subgroup.metrics)
                                   .any(metrics => activeFilters.any(filter => metrics.indexOf(filter.col) !== -1));

                      return { name, active, type: 'metric' };
                    });

    return [...discrete, ...metric];
  }

  @computed('viewing', 'activeFilters')
  get selectedValues() {
    const activeFilters = this.get('activeFilters');
    let result = [];

    if (activeFilters.length > 0) {
      const viewing = this.get('viewing');
      const found = activeFilters.filter(_filter => _filter.name === viewing.name)[0];
      
      if (found) {
        result = found.value;
      }
    }

    return result;
  }

  @action
  view(group) {
    this.set('viewing', group);
  }

}
