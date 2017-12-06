import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';


export default class extends Component {

  constructor() {
    super();

    this.classNames = ['component', 'search-bar'];

    this.searchQuery = '';
    this.model = [];
  }

  @reads('model') items

  @computed('searchQuery', 'items')
  get searchList() {
    const searchQuery = this.get('searchQuery');
    let items = this.get('items');

    if (searchQuery.length >= 2) {
      console.log(searchQuery);
    }

    return items;
  }

}
