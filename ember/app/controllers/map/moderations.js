import Controller from '@ember/controller';
import { action } from 'ember-decorators/object';


export default class extends Controller {

  @action
  toggleViewModeration(id) {
    const li = document.querySelector(`li[data-mod-id="${id}"]`);

    li.classList.toggle('active');
  }

}
