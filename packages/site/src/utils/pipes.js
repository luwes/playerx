const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const defaults = {
  input: '.',
  output: '_dest'
};

module.exports = {
  configFunction: (eleventyConfig, options) => {
    const { input, output, pipes } = Object.assign(defaults, options);

    for (let dir in pipes) {
      eleventyConfig.addWatchTarget(path.join(input, dir));
    }

    eleventyConfig.addTransform('pipes', async (content) => {
      await Promise.all(
        Object.values(pipes)
          .map((pipe) => exec(pipe))
      );
      return content;
    });

    eleventyConfig.setBrowserSyncConfig({
      files: Object.keys(pipes)
        .map((dir) => path.join(output, dir))
    });
  }
};
