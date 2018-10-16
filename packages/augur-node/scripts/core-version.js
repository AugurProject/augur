var package = require("../node_modules/augur.js/package.json");
var version = package.dependencies["augur-core"];

if (!version) {
  console.log("Could not find version of augur-core in package.json");
  process.exit(1);
}

console.log(version);
