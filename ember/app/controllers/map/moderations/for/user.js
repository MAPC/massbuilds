import Controller from '@ember/controller';
import { filters } from 'massbuilds/utils/filters';
import { action, computed } from 'ember-decorators/object';


export default class extends Controller {

  @computed('model.[]')
  get moderations() {
    const model = this.get('model');
    const moderations = [];

    model.forEach(record => {
      const changes = Ember.copy(record.get('proposedChanges'));

      for (let col in changes) {
        changes[col] = {
          name: filters[col].name,
          oldValue: record.get(`development.${col}`),
          newValue: changes[col],
        };
      }

      record.set('changes', changes);
      moderations.push(record);
    });

    return moderations;
  }


  @action
  toggleViewModeration(id) {
    const li = document.querySelector(`li[data-mod-id="${id}"]`);
    const button = li.querySelector('.view-button');

    li.classList.toggle('active');
    button.innerText = (li.classList.contains('active') ? 'Hide' : 'View') + ' Moderation';
  }

}
