import Ember from 'ember';
import serializeKeys from 'massbuilds/utils/serialize-keys';
import developmentSerialHash from 'massbuilds/utils/development-serial-hash';


export default function castToModel(model, data) {
  const serialized = serializeKeys(data, Ember.String.camelize);
  const attributes = Ember.get(model, 'attributes._values');

  const typeMap = Object.values(attributes)
                        .reduce((a,b) => {
                          a[b.name] = b.type;
                          return a;
                        }, {});

  const typeCaster = {
    number: Number,
    string: String,
    boolean: Boolean
  };

  Object.keys(serialized).forEach(key => {
    const newKey = (developmentSerialHash[key] || Ember.String.underscore(key));

    serialized[newKey] = typeCaster[typeMap[key]](serialized[key]);
    
    if (newKey !== key) {
      delete serialized[key];
    }
  });

  return serialized;
}
