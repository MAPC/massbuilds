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
    const filters = this.get('activeFilters');

    const discrete = ['Developer', 'Town/City'].map(title => {
                        let active = false; 

                        return { title, active, type: 'discrete' };
                      });

    const metric = Object.keys(metricGroups).map(title => {
                      let active = metricGroups[title]
                                   .map(subgroup => subgroup.metrics)
                                   .any(metrics => filters.any(filter => metrics.indexOf(filter.col) !== -1));

                      return { title, active, type: 'metric' };
                    });

    return [...discrete, ...metric];
  }

  @computed('filterGroups')
  get viewing() {
    return this.get('filterGroups')[0];
  }

  set viewing(group) {
    return group;
  }

  @action
  view(group) {
    this.set('viewing', group);
  }

}
