import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { metricGroups } from 'massbuilds/utils/filters';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'filter-panel'];
  }

  @computed('activeFilters')
  get filterGroups() {
    const activeFilters = this.get('activeFilters');

    const discrete = ['Developer', 'Town/City'].map(name => {
                        let active = false; 

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
    const viewing = this.get('viewing');
    const activeFilters = this.get('activeFilters');

    const result =  activeFilters.filter(_filter => _filter.name === viewing.name)[0].value;

    console.log(result);

    return result;
  }

  get viewing() {
    return this.get('filterGroups')[1];
  }

  set viewing(group) {
    return group;
  }

  @action
  view(group) {
    this.set('viewing', group);
  }

}
