const fs   = require('fs');
const yaml = require('js-yaml');

module.exports = yaml.load(fs.readFileSync(`${__dirname}/../compare.yaml`, 'utf8'));
