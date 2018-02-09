import DS from 'ember-data';
import { attr, belongsTo } from 'ember-decorators/data';


export default class extends DS.Model {

  @belongsTo('development') development
  @belongsTo('user', { async: true }) user

  @attr('boolean', { default: false }) approved

  @attr('json') proposedChanges

  @attr('date') createdAt

}
