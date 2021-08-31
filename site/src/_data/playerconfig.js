const yaml = require('js-yaml');
const fs   = require('fs');

module.exports = async () => {
  let players;
  let input;
  try {
    input = fs.readFileSync(`${__dirname}/players.yaml`, 'utf8');
    players = yaml.load(input);
  } catch (e) {
    console.log(e);
  }

  return JSON.stringify(players.reduce((acc, { key, options }) => {
    if (options) acc[key] = options;
    return acc;
  }, {}));
};
