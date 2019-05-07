var plantuml = require('node-plantuml');
var fs = require('fs');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

// Loop through all the files in the temp directory
fs.readdir("./diagrams", function (err, files = []) {
  var pumlFilePattern = new RegExp('.+\.puml$');
  files.map((filename = "") => {
    if (pumlFilePattern.test(filename)) {
      var gen = plantuml.generate(`diagrams/${filename}`);
      gen.out.pipe(fs.createWriteStream(`diagrams/${filename.replace(".puml", ".png")}`));
    }
  })
});

