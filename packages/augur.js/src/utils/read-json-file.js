var fs = require("fs");

function readJsonFile(path, callback) {
  fs.readFile(path, function (err, data) {
    try {
      if (err) return callback(err);
      callback(null, JSON.parse(data));
    } catch (e) {
      callback(e);
    }
  });
}

module.exports = readJsonFile;
