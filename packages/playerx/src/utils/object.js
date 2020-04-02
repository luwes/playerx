
export function pick(names, obj) {
  let result = {};
  names.forEach(name => {
    if (name in obj) result[name] = obj[name];
  });
  return result;
}
