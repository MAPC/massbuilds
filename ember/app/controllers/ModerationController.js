import Ember from 'ember';
import Controller from '@ember/controller';
import { filters } from 'massbuilds/utils/filters';
import { action, computed } from 'ember-decorators/object';


export default class extends Controller {

  @computed('model.[]', 'model.@each.development')
  get moderations() {
    const model = this.get('model');
    const moderations = [];

    console.log(model);

    model.forEach(record => {
      const changes = Ember.copy(record.get('proposedChanges'));

      for (let col in changes) {
        const emberCol = Ember.String.camelize(col);

        changes[emberCol] = {
          name: filters[emberCol].name,
          oldValue: record.get(`development.${emberCol}`),
          newValue: changes[col],
        };

        if (emberCol !== col) {
          delete changes[col];
        }
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
