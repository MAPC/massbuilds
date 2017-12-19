import Component from '@ember/component';
import { computed, action } from 'ember-decorators/object';
import filters, { metricGroups } from 'massbuilds/utils/filters';


export default class extends Component {

  constructor() {
    super();

    this.get('subgroups').forEach(subgroup => {
      subgroup.metrics.forEach(metric => {
        this.set(metric.col, metric);
      });
    });
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


  @action
  toggleCheckbox(metric) {
    Ember.set(metric, 'value', !(metric.value == true));

    this.updateFilter(metric);
  }


  @action 
  updateMetricInflector(metricSelected) {
    const filter = this.get(metricSelected.name.replace('-inf', ''));
    this.set(`${filter.col}.inflector`, metricSelected.value);

    this.updateFilter(filter);
  }


  @action
  updateMetricOption(metricSelected) {
    const filter = this.get(metricSelected.name);
    this.set(`${filter.col}.value`, metricSelected.value);

    this.updateFilter(filter);
  }


  @action
  updateFilter(filter) {
    this.sendAction('update', { [filter.col]: filter });
  }
  

}
