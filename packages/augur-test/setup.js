const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = () => {
  // NOTE: This uses your system's default Node installation.
  //       If this line fails due to mismatched Node versions then that's why.
  return exec(`/usr/bin/env yarn workspace @augurproject/tools flash --network none create-basic-seed`);
};
