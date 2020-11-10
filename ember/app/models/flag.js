import DS from 'ember-data';
import { attr, belongsTo } from 'ember-decorators/data';

export default class extends DS.Model {
  @belongsTo('development', { async: true}) development;
  @attr('string') reason;
  @attr('boolean') isResolved;
  @attr('date') createdAt;
  @attr('date') updatedAt;
}
