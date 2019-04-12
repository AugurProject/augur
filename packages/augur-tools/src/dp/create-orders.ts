import chalk from "chalk";

import approveAugurEternalApprovalValue from "./lib/approve-augur-eternal-approval-value";
import createOrders from "./lib/create-orders";
import { getPrivateKey } from "./lib/get-private-key";
import * as connectionEndpoints from "./connection-endpoints";

import { Augur } from "@augurproject/api";

export function _createOrders(augur:Augur, auth, callback) {
  console.log(chalk.cyan.dim("networkId:"), chalk.cyan(augur.rpc.getNetworkID()));
  const universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  approveAugurEternalApprovalValue(augur, auth.address, auth, function(err) {
    if (err) return console.error(err);
    augur.markets.getMarkets({ universe: universe, sortBy: "creationBlockNumber" }, function(err, marketIds) {
      console.log("marketIds:", marketIds);
      if (err) return console.error(err);
      createOrders(augur, marketIds, auth, function(err) {
        if (err) callback(err);
        callback(null);
      });
    });
  });
}

if (require.main === module) {
  const keystoreFilePath = process.argv[2];

  const augur = new Augur();

  getPrivateKey(keystoreFilePath, function(err, auth) {
    if (err) return console.error("getPrivateKey failed:", err);
    augur.connect(connectionEndpoints, function(err) {
      if (err) return console.error(err);

      _createOrders(augur, auth, function(err) {
        if (err) {
          console.error(chalk.red.bold("Canned order creation failed:"), err);
          process.exit(1);
        }
        process.exit();
      });
    });
  });
}
