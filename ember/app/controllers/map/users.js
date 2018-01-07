import Controller from '@ember/controller';
import { action, computed } from 'ember-decorators/object';


export default class extends Controller {

  constructor() {
    super();

    this.roles = ['user', 'verified', 'municipal'];
    this.searchQuery = '';

    const pageLength = 25;
    this.pageLength = pageLength;
    this.min = 0;
    this.max = pageLength;
  }


  @computed('model.[]')
  get sortedUsers() {
    return this.get('model').sortBy('lastName', 'firstName');
  }


  @computed('sortedUsers', 'searchQuery')
  get filteredUsers() {
    const sortedUsers = this.get('sortedUsers');
    const searchQuery = this.get('searchQuery').toLowerCase();
    const { min, max } = this.getProperties('min', 'max');

    const searchable = ['lastName', 'firstName', 'email', 'fullName'];
    let filteredUsers = Ember.copy(sortedUsers);

    if (searchQuery.length > 0) {
      filteredUsers = sortedUsers.filter(user => {
        return searchable.any(attr => user.get(attr).toLowerCase().startsWith(searchQuery));
      });
    }

    return filteredUsers.splice(min, max);
  }


  @action
  updateUser(user) {
    const newRole = document.querySelector(`select[name="${user.id}-role"]`).value;

    if (newRole) {
      user.set('role', newRole);
      user.save();
    }
  }

}
