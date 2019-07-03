const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = () => {
  // NOTE: This uses your system's default Node installation.
  //       If this line fails due to mismatched Node versions then that's why.
  return exec(`/usr/bin/env yarn flash run -n none create-seed-file`);
};
