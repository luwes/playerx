const fs   = require('fs');
const yaml = require('js-yaml');

module.exports = yaml.load(fs.readFileSync(`${__dirname}/../players.yaml`, 'utf8'));
