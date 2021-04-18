const axios  = require('axios');
const yaml = require('js-yaml');
const fs   = require('fs');

require('dotenv').config();

const token = Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`, 'utf8').toString('base64');

module.exports = () => {

  fetchMetric('viewer_experience_score', 'https://api.mux.com/data/v1/metrics/viewer_experience_score/breakdown?order_by=value&order_direction=desc&measurement=avg&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1');

  fetchMetric('video_startup_time', 'https://api.mux.com/data/v1/metrics/video_startup_time/breakdown?order_by=value&order_direction=asc&measurement=median&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1');

  fetchMetric('player_startup_time', 'https://api.mux.com/data/v1/metrics/player_startup_time/breakdown?order_by=value&order_direction=asc&measurement=median&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1');

  fetchMetric('smoothness_score', 'https://api.mux.com/data/v1/metrics/smoothness_score/breakdown?order_by=value&order_direction=desc&measurement=avg&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1');
};

function fetchMetric(name, url) {

  axios.get(url, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  })
  .then(response => {
    let doc;
    let input;
    try {
      input = fs.readFileSync(`${__dirname}/compare.yaml`, 'utf8');
      doc = yaml.load(input);
    } catch (e) {
      console.log(e);
    }

    const metrics = response.data.data;
    for (let player of doc.players) {
      player[name] = metrics.find((obj) => obj.field === player.key).value;
    }

    if (input !== yaml.dump(doc)) {
      fs.writeFileSync(`${__dirname}/compare.yaml`, yaml.dump(doc));
    }

  })
  .catch(err => {
    console.log(err);
  });

}
