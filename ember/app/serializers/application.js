import { underscore } from '@ember/string';
import DS from 'ember-data';
import developmentSerialHash from 'massbuilds/utils/development-serial-hash';

export default DS.JSONAPISerializer.extend({

  keyForAttribute(attr) {
    return developmentSerialHash[attr] || underscore(attr);
  }

});
