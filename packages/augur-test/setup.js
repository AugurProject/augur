const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = () => {
  return exec(`/usr/bin/env yarn dp create-seed-file`);
};
