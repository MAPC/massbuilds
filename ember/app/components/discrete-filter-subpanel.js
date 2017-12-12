import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import discreteMap from 'massbuilds/utils/discrete-map';

export default class extends Component {

  @service map

  constructor()  {
    super();

    this.classNames = ['component', 'subpanel', 'discrete-filter'];

    this.view = 'selected';
    this.searchQuery = '';
  }

  @computed('map', 'viewing.name')
  get values() {
    const data = this.get('map.data');
    const name = this.get('viewing.name');

    return data.map(datum => datum.get(discreteMap[name]))
               .filter(datum => !!datum)
               .uniq()
               .sort();
  }


  @computed('values', 'selectedValues.[]', 'searchQuery')
  get filteredValues() {
    const values = this.get('values');
    const selectedValues = this.get('selectedValues');
    const searchQuery = this.get('searchQuery');

    let filtered = values.filter(value => selectedValues.indexOf(value) === -1);

    if (searchQuery.length >= 1) {
      let query = searchQuery.toLowerCase();
      filtered = filtered.filter(value => value.toLowerCase().startsWith(query));
    }

    return filtered.sort();
  }


  @computed('viewing.name') 
  get placeholder() {
    const name = this.get('viewing.name');

    return `Type here to search filters by ${name}`;
  }
  

  @action
  changeView(view) {
    this.set('view', view);
  }

  @action
  select(value) {
    const selected = this.get('selectedValues');
    selected.pushObject(value);
  }


  @action 
  deselect(value) {
    this.get('selectedValues').popObject(value);
  }


}
