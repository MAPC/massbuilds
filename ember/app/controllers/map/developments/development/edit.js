import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';


export default class extends Controller {

  @service currentUser


  @action
  createEdit(proposedChanges) {
    const newEdit = this.get('store').createRecord('edit', {
      development: this.get('model'),
      user: this.get('currentUser.user'),
      proposedChanges: JSON.stringify(proposedChanges)
    });

    console.log(newEdit);

    newEdit.save().then(response => {
      this.transitionToRoute('map.developments.development.index', this.get('model'));
    });
  }


}
