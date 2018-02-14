import Ember from 'ember';
import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';


export default class extends Component {

  @service notifications


  constructor() {
    super(...arguments);

    this.classNames = ['component', 'notifications-popup'];
    this.timer = null;
  }


  @computed('notifications.tick')
  get observe() {
    if (this.get('notifications.tick') === null) {
      return;
    }

    Ember.run.cancel(this.get('timer'));

    this.set('active', true);

    console.log(this.get('active'));

    this.set('timer', Ember.run.later(this, () => {
      this.set('active', false);
    }, 5000));
  }


};
