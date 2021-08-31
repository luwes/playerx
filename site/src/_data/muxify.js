const axios = require('axios');
const yaml = require('js-yaml');
const fs   = require('fs');

require('dotenv').config();

const token = Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`, 'utf8').toString('base64');

module.exports = async () => {

  await Promise.all([
    fetchMetric('viewer_experience_score', 'https://api.mux.com/data/v1/metrics/viewer_experience_score/breakdown?order_by=value&order_direction=desc&measurement=avg&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1'),

    fetchMetric('video_startup_time', 'https://api.mux.com/data/v1/metrics/video_startup_time/breakdown?order_by=value&order_direction=asc&measurement=median&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1'),

    fetchMetric('player_startup_time', 'https://api.mux.com/data/v1/metrics/player_startup_time/breakdown?order_by=value&order_direction=asc&measurement=median&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1'),

    fetchMetric('smoothness_score', 'https://api.mux.com/data/v1/metrics/smoothness_score/breakdown?order_by=value&order_direction=desc&measurement=avg&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1'),

    fetchMetric('rebuffer_percentage', 'https://api.mux.com/data/v1/metrics/rebuffer_percentage/breakdown?order_by=value&order_direction=asc&measurement=avg&timeframe%5B%5D=7%3Adays&group_by=player_software&limit=50&page=1')
  ]);

  return yaml.load(fs.readFileSync(`${__dirname}/players.yaml`, 'utf8'));
};

function fetchMetric(name, url) {
  return axios.get(url, {
    headers: {
      'Authorization': `Basic ${token}`
    }
  })
  .then(response => {
    let players;
    let input;
    try {
      input = fs.readFileSync(`${__dirname}/players.yaml`, 'utf8');
      players = yaml.load(input);
    } catch (e) {
      console.log(e);
    }

    const metrics = response.data.data;
    for (let player of players) {
      const metric = metrics.find((obj) => obj.field === player.key);
      if (metric) {
        player[name] = metric.value;
      }
    }

    players.sort((a, b) => b.viewer_experience_score - a.viewer_experience_score);

    if (input !== yaml.dump(players, { lineWidth: -1 })) {
      fs.writeFileSync(`${__dirname}/players.yaml`, yaml.dump(players, { lineWidth: -1 }));
    } else {
      console.log('No changes in players.yaml');
    }

  })
  .catch(err => {
    console.log(err);
  });

}
