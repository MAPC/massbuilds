import DS from 'ember-data';
import { attr, belongsTo } from 'ember-decorators/data';

export default class extends DS.Model {

  @belongsTo('development') development
  @belongsTo('user', { async: true }) user

  @attr('string') proposedChanges

  @attr('date') createdAt

}
