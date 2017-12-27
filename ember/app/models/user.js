import DS from 'ember-data';
import { computed } from 'ember-decorators/object';
import { attr, hasMany } from 'ember-decorators/data';


export default class extends DS.Model {

  @attr('string') email
  @attr('string') password
  @attr('string') firstName
  @attr('string') lastName
  @attr('string') municipality
  @attr('string') role

  @hasMany('developments') developments

  @computed('firstName', 'lastName')
  get fullName() {
    const { firstName, lastName } = this.getProperties('firstName', 'lastName');
    return `${firstName} ${lastName}`;
  }

}
