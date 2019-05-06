
var fs = require("fs");
var chalk = require("chalk");
var keythereum = require("keythereum");
var speedomatic = require("speedomatic");

var keystoreFilePath = process.argv[2];
var recoveryPassword = process.argv[3];

if (!keystoreFilePath) { console.log(chalk.red("Keystore File is needed")); process.exit(1);}
if (!recoveryPassword) { console.log(chalk.red("Recovery Password is needed")); process.exit(1);}

fs.readFile(keystoreFilePath, function (err, keystoreJson) {
  if (err) Error(err);
  var keystore = JSON.parse(keystoreJson);
  var address = speedomatic.formatEthereumAddress(keystore.address);
  console.log(chalk.green.dim("sender:"), chalk.green(keystore.address));
  console.log(chalk.green.dim("ethereum addr:"), chalk.green(address));
  keythereum.recover(recoveryPassword, keystore, function (privateKey) {
    if (privateKey == null || privateKey.error) {
      console.log(chalk.red("private key decryption failed"));
      process.exit(1);
    }
    console.log(chalk.green.dim("private key:"), chalk.green(privateKey.toString("hex")));
    process.exit(0);
  });
});
