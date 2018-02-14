import Ember from 'ember';
import developmentSerialHash from 'massbuilds/utils/development-serial-hash';


export default function castToModel(model, data) {
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

  Object.keys(data).forEach(key => {
    const newKey = (developmentSerialHash[key] || Ember.String.underscore(key));

    data[newKey] = typeCaster[typeMap[key]](data[key]);
    
    if (newKey !== key) {
      delete data[key];
    }
  });

  return data;
}
