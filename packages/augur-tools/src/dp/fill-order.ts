import chalk from "chalk";

import Augur from "augur.js";
import approveAugurEternalApprovalValue from "./lib/approve-augur-eternal-approval-value";
import fillBothOrderTypes from "./lib/fill-both-order-types";
import { getPrivateKey } from "./lib/get-private-key";
import connectionEndpoints from "../connection-endpoints";
import debugOptions from "../debug-options";

const keystoreFilePath = process.argv[2];

const augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

getPrivateKey(keystoreFilePath, function(err, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function(err) {
    if (err) return console.error(err);
    const universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    const fillerAddress = auth.address;
    console.log(chalk.cyan.dim("networkId:"), chalk.cyan(augur.rpc.getNetworkID()));
    console.log(chalk.green.dim("universe:"), chalk.green(universe));
    approveAugurEternalApprovalValue(augur, fillerAddress, auth, function(err) {
      if (err) return console.error(err);
      const outcomeToFill = process.env.OUTCOME_TO_FILL || 1;
      const sharesToFill = process.env.SHARES_TO_FILL || "1";
      fillBothOrderTypes(augur, universe, fillerAddress, outcomeToFill, sharesToFill, auth, function(err) {
        if (err) console.error("fillBothOrderTypes failed:", err);
        process.exit();
      });
    });
  });
});
