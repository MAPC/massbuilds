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

  @attr('boolean') requestVerifiedStatus

  @attr('date') createdAt

  @hasMany('edits', {async: true}) edits
  @hasMany('developments', {async: true}) developments

  @computed('firstName', 'lastName')
  get fullName() {
    const { firstName, lastName } = this.getProperties('firstName', 'lastName');
    return `${firstName} ${lastName}`;
  }

  @computed('firstName', 'lastName', 'email')
  get displayName() {
    const { fullName, email } = this.getProperties('fullName', 'email');
    return email.endsWith('mapc.org') ? 'MAPC Staff' : fullName;
  }

}
