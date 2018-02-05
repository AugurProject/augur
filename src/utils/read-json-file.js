const { promisify } = require("util");
const fs = require("fs");

function readJsonFileCallback(path, cb) {
  fs.readFile(path, (err, data) => {
    if (err)
      cb(err)
    else
      cb(null, JSON.parse(data))
  })
}

const readJsonFile = promisify(readJsonFileCallback);

module.exports = { readJsonFileCallback, readJsonFile };
