/**
 * Create a handful of canned markets for us to test with.
 */

import chalk from "chalk";

import Augur from "augur.js";
import { createMarkets } from "./lib/create-markets";
import { getPrivateKey } from "./lib/get-private-key";
import * as connectionEndpoints from "./connection-endpoints";

const keystoreFilePath = process.argv[2];

const augur = new Augur();



export { createMarkets };

if (require.main === module) {
  getPrivateKey(keystoreFilePath, function(err, auth) {
    if (err) return console.error("getPrivateKey failed:", err);
    augur.connect(
      connectionEndpoints,
      function(err) {
        if (err) return console.error("connect failed:", err);
        createMarkets(augur, auth, function(err) {
          if (err) {
            console.error(
              chalk.red.bold("Canned market creation failed:"),
              err
            );
            process.exit(1);
          }
          process.exit();
        });
      }
    );
  });
}
