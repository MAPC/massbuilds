import Component from '@ember/component';
import { action } from 'ember-decorators/object';


export default Component.extend({

  @action
  view(id) {
    this.sendAction('viewDevelopment', id);
  }

});
