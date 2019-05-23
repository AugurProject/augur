import { Augur } from "@augurproject/sdk";
import { BigNumber } from "../types";
import { EthersProvider } from "@augurproject/ethersjs-provider";
//
// var chalk = require("chalk/types");
// var speedomatic = require("speedomatic/build/index");
// var getPrivateKey = require("./dp/lib/get-private-key").getPrivateKey;
// var connectionEndpoints = require("../connection-endpoints");
// var debugOptions = require("./debug-options");

export async function repFaucet(augur:Augur, amount:BigNumber) {
  return augur.contracts.cash.faucet(amount);
}


//
// if (require.main === module) {
//   // invoked from the command line
//   var augur = new Augur();
//   augur.rpc.setDebugOptions(debugOptions);
//   var keystoreFilePath = process.argv[2];
//   augur.connect(
//     { ethereumNode: connectionEndpoints.ethereumNode },
//     function(err) {
//       if (err) return console.error(err);
//       console.log(
//         chalk.cyan.dim("networkId:"),
//         chalk.cyan(augur.rpc.getNetworkID())
//       );
//       getPrivateKey(keystoreFilePath, function(err, auth) {
//         if (err) return console.log("Error: ", err);
//         repFaucet(augur, 100000, auth, function(err) {
//           if (err) {
//             console.log("Error: ", err);
//             process.exit(1);
//           }
//           console.log("Rep Faucet Success");
//           process.exit(0);
//         });
//       });
//     }
//   );
// }
