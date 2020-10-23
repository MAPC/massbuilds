import { copy } from '@ember/object/internals';
import Component from '@ember/component';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import discreteMap from 'massbuilds/utils/discrete-map';


export default class extends Component {

  @service map

  constructor()  {
    super();

    this.classNames = ['component', 'subpanel', 'discrete-filter'];

    this.view = (this.get('selectedValues').length === 0) ? 'search' : 'selected';
    this.searchQuery = '';
  }


  @computed('selectedValues')
  get valueUpdater() {
    this.set('selected', copy(this.get('selectedValues')));
  }


  @computed('map', 'viewing.name')
  get values() {
    const data = this.get('map.stored');
    const name = this.get('viewing.name');

    return data.map(datum => datum.get(discreteMap[name]))
               .filter(datum => !!datum)
               .uniq()
               .sort();
  }


  @computed('values', 'selected.[]', 'searchQuery')
  get filteredValues() {
    const values = this.get('values');
    const selected = this.get('selected');
    const searchQuery = this.get('searchQuery');

    let filtered = copy(values);

    if (searchQuery.length >= 1) {
      let query = searchQuery.toLowerCase();
      filtered = filtered.filter(value => value.toLowerCase().startsWith(query));
    }

    return filtered.sort().map(value => {
      return { 
        value, 
        isSelected: (selected.indexOf(value) !== -1)
      }; 
    });
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
    const selected = this.get('selected');

    if (selected.indexOf(value) !== -1) {
      return this.deselect(value);
    }

    selected.pushObject(value);
    this.set('selected', selected.sort());

    this.updateFilter();
  }


  @action 
  deselect(value) {
    const selected = this.get('selected');
    selected.removeObject(value);

    if (selected.get('length') === 0) {
      this.changeView('search');
    }

    this.updateFilter();
  }


  @action
  updateFilter() {
    this.sendAction('update', { [this.get('viewing.col')]: copy(this.get('selected')) });
  }


}
