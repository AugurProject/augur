import Augur from "augur.js";

import approveAugurEternalApprovalValue from "./lib/approve-augur-eternal-approval-value";
import cancelOrders from "./lib/cancel-orders";
import { getPrivateKey } from "./lib/get-private-key";
import connectionEndpoints from "../connection-endpoints";

const keystoreFilePath = process.argv[2];

const augur = new Augur();

getPrivateKey(keystoreFilePath, function(err:Error, auth) {
  if (err) return console.error("getPrivateKey failed:", err);
  augur.connect(connectionEndpoints, function(err) {
    if (err) return console.error(err);
    const creatorAddress = auth.address;
    approveAugurEternalApprovalValue(augur, creatorAddress, auth, function(err:Error) {
      if (err) return console.error(err);
      const universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
      cancelOrders(augur, creatorAddress, universe, auth, function(err:Error) {
        if (err) console.error(err);
        process.exit();
      });
    });
  });
});
