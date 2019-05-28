const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = () => {
  return exec(`/usr/bin/env yarn workspace @augurproject/tools dp create-seed-file`);
};
