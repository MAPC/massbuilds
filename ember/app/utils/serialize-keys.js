export default function serializeKeys(data, serializer) {
  return Object.keys(data)
               .reduce((obj,key) => Object.assign(obj, {[serializer(key)]: data[key]}), {});
}
