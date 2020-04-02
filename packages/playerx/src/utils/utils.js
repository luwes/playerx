
export function bindAll(methodNames, obj) {
  methodNames.forEach(name => {
    if (name in obj) obj[name] = obj[name].bind(obj);
  });
  return obj;
}
