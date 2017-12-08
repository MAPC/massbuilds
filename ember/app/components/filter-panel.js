import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { metricGroups } from 'massbuilds/utils/filters';
import { reads } from 'ember-decorators/object/computed';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'filter-panel'];

    this.viewing = Object.keys(metricGroups)[0];
    this.activeModels = [];
  }

  @computed('filters')
  get filterGroups() {
    const filters = this.get('activeFilters');
    console.log(filters);

    return Object.keys(metricGroups)
                .map(title => {
                  var active = metricGroups[title].map(subgroup => subgroup.metrics)
                                    .any(metrics => filters.any(filter => metrics.indexOf(filter.col) !== -1));

                  console.log(title, active);

                  return { title, active };
                });
  }


  @action
  view(group) {
    this.set('viewing', group.title);
  }

}
