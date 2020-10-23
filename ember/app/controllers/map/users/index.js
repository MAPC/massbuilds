import { copy } from '@ember/object/internals';
import Controller from '@ember/controller';
import { action, computed } from 'ember-decorators/object';

export default class extends Controller {

  constructor() {
    super();

    this.roles = ['user', 'verified', 'municipal', 'admin', 'disabled'];

    this.searchQuery = '';
    this.roleFilter = 'all';
  }


  @computed('model.[]')
  get sortedUsers() {
    return this.get('model').sortBy('lastName', 'firstName');
  }


  @computed('sortedUsers', 'searchQuery', 'roleFilter')
  get filteredUsers() {
    const sortedUsers = this.get('sortedUsers');
    const roleFilter = this.get('roleFilter');
    const searchQuery = this.get('searchQuery').toLowerCase();

    const searchable = ['lastName', 'firstName', 'email', 'fullName', 'municipality'];
    let filteredUsers = copy(sortedUsers);

    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.get('role') === roleFilter);
    }

    if (searchQuery.length > 0) {
      filteredUsers = filteredUsers.filter(user => {
        return searchable.any(attr => (user.get(attr) || '').toLowerCase().startsWith(searchQuery));
      });
    }

    return filteredUsers;
  }


  @action
  updateUser(user) {
    const newRole = document.querySelector(`select[name="${user.id}-role"]`).value;

    if (newRole) {
      user.set('role', newRole);
      user.save();
    }
  }


  @action
  filterRole() {
    this.set('roleFilter', document.querySelector('select[name="role-filter"]').value);
  }

}
