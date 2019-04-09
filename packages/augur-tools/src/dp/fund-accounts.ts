import chalk from "chalk";

import Augur from "augur.js";
import fundAccounts from "./lib/fund-accounts";
import { getPrivateKey } from "./lib/get-private-key";
import connectionEndpoints from "../connection-endpoints";
import debugOptions from "../debug-options";

const etherFundingPerAccount = process.env.ETHER_FUNDING_PER_ACCOUNT || "10000";

const accountsToFund = (process.argv[2] || "").split(",");

if (!Array.isArray(accountsToFund) || !accountsToFund.length) {
  console.error("Must specify accounts to fund");
  process.exit(1);
}

const keystoreFilePath = process.argv[3];

const augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

export default fundAccounts;

if (require.main === module) {
  getPrivateKey(keystoreFilePath, function(err, auth) {
    if (err) return console.error("getPrivateKey failed:", err);
    augur.connect({ ethereumNode: connectionEndpoints.ethereumNode }, function(err) {
      if (err) return console.error("connect failed:", err);
      fundAccounts(augur, accountsToFund, etherFundingPerAccount, auth, function(err) {
        if (err) {
          console.error(chalk.red.bold("Fund accounts failed:"), err);
          process.exit(1);
        }
        process.exit(0);
      });
    });
  });
}
