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
    data[key] = typeCaster[typeMap[key]](data[key]);
  });

  return data;
}
