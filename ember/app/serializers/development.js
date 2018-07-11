import Ember from 'ember';
import DS from 'ember-data';
import developmentSerialHash from 'massbuilds/utils/development-serial-hash';

export default class extends DS.JSONAPISerializer {

  keyForAttribute(attr) {
    return developmentSerialHash[attr] || Ember.String.underscore(attr);
  }

  serializeAttribute(snapshot, json, key, attributes)  {
    if (snapshot.record.get('isNew') || snapshot.changedAttributes()[key])  {
      super.serializeAttribute(snapshot, json, key, attributes);
    }
  }

}
