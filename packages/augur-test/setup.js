const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = () => {
  return exec(`/usr/bin/env ts-node ${__dirname}/build/scripts/build-ganache.js`);
};
