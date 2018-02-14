import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import filters, { metricGroups } from 'massbuilds/utils/filters';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'filter-panel'];

    this.viewing = this.get('filterGroups')[3];
  }


  @computed('activeFilters')
  get filterGroups() {
    const activeFilters = this.get('activeFilters');

    const discrete = ['Town/City', 'Neighborhood', 'Developer'].map(name => {
                        let active = activeFilters.any(filter => filter.name === name); 
                        let col = Object.values(filters).filter(x => x.name === name)[0].col;

                        return { name, col, active, type: 'discrete' };
                      });

    const metric = Object.keys(metricGroups).map(name => {
                      let active = metricGroups[name]
                                   .map(subgroup => subgroup.metrics)
                                   .any(metrics => activeFilters.any(filter => metrics.indexOf(filter.col) !== -1));

                      return { name, active, type: 'metric' };
                    });

    return [...discrete, ...metric];
  }


  @computed('viewing', 'activeFilters.[]')
  get selectedValues() {
    const activeFilters = this.get('activeFilters');
    let result = [];

    if (activeFilters.length > 0) {
      const viewing = this.get('viewing');
      const found = activeFilters.filter(_filter => _filter.name === viewing.name);
      
      if (found) {
        result = (found.length === 1) ? found[0].value : found;
      }
    }

    return result;
  }


  @action
  view(group) {
    this.set('viewing', group);
  }


  @action
  update(filter) {
    this.sendAction('update', filter);
  }

}
