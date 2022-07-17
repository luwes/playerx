const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const playerx = require('playerx/dist/config.umd.js');

require('dotenv').config();

const projectId = '49de72e2-f68e-40c4-be22-26ab2a2917b0';
const apiUrl = `https://lhci.playerx.io/v1/projects/${projectId}`;

module.exports = async () => {
  const buildId = (
    await axios.get(`${apiUrl}/builds?limit=1&lifecycle=sealed`, {
      timeout: 1000,
    })
  ).data[0]?.id;

  if (buildId) {
    await Promise.all([
      fetchMetric(
        'category_performance_median',
        `${apiUrl}/builds/${buildId}/statistics`
      ),
    ]);
  }

  return yaml.load(fs.readFileSync(`${__dirname}/players.yaml`, 'utf8'));
};

function fetchMetric(name, url) {
  return axios
    .get(url, {
      timeout: 1000,
    })
    .then((response) => {
      let players;
      let input;
      try {
        input = fs.readFileSync(`${__dirname}/players.yaml`, 'utf8');
        players = yaml.load(input);
      } catch (e) {
        console.log(e);
      }

      let metrics = response.data;
      metrics = metrics.filter((item) => item.name === name);
      metrics = metrics.map((item) => {
        // Get the url param from `https://api.playerx.io/render?url=` if needed.
        let renderUrl = new URL(item.url);
        return {
          ...item,
          testUrl: renderUrl.searchParams.get('url') || item.url,
        };
      });

      for (let player of players) {
        if (!playerx[player.key]) continue;

        // There is a bug where hls.js is given a LH performance score of Mux
        // ignore for now as the standalone players are not on the compare page.
        const metric = metrics.find((item) => {
          return new RegExp(playerx[player.key].srcPattern).test(item.testUrl);
        });
        if (metric) {
          player[name] = metric.value;
          player.lighthouse_test_url = metric.url;
        }
      }

      if (input !== yaml.dump(players, { lineWidth: -1 })) {
        fs.writeFileSync(
          `${__dirname}/players.yaml`,
          yaml.dump(players, { lineWidth: -1 })
        );
      } else {
        console.log('No changes in players.yaml');
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
