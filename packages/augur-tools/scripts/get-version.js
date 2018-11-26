var package = require(process.argv[2]);
var version = package.version;

if (!version) {
  console.log("Could not find version in package.json");
  process.exit(1);
}

console.log(version);
