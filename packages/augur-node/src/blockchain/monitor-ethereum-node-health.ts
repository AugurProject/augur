import { Augur } from "augur.js";
import { ErrorCallback } from "../types";

let monitorEthereumNodeHealthId: NodeJS.Timer;

export function monitorEthereumNodeHealth(errorCallback: ErrorCallback | undefined, augur: Augur) {
  const networkId: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkId].Universe;
  const controller: string = augur.contracts.addresses[networkId].Controller;
  if (monitorEthereumNodeHealthId) {
    clearInterval(monitorEthereumNodeHealthId);
  }

  monitorEthereumNodeHealthId = setInterval(() => {
    augur.api.Universe.getController({ tx: { to: universe } }, (err: Error, universeController: string) => {
      if (err) {
        clearInterval(monitorEthereumNodeHealthId);
        if (errorCallback) errorCallback(new Error(`Controller Match Lookup Error. Check if universe "${universe}" exists. ${err.message}`));
      }
      if (universeController !== controller) {
        clearInterval(monitorEthereumNodeHealthId);
        if (errorCallback) errorCallback(new Error(`Controller mismatch. Configured: ${controller} Found: ${universeController}`));
      }
    });
  }, 5000);
}
