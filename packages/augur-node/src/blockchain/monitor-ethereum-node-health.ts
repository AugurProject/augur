import { Augur } from "augur.js";
import { ErrorCallback } from "../types";

const POLLING_FREQUENCY_IN_MS = 5000;

let monitorEthereumNodeHealthId: NodeJS.Timer;

async function checkEthereumNodeHealth(augur: Augur, universe: string, controller: string) {
  return new Promise<void>((resolve, reject) => {
    augur.api.Universe.getController({ tx: { to: universe } }, (err: Error, universeController: string) => {
      if (err) {
        return reject(new Error(`Controller Match Lookup Error. Check if universe "${universe}" exists. ${err.message}`));
      }
      if (universeController !== controller) {
        return reject(new Error(`Controller mismatch. Configured: ${controller} Found: ${universeController}`));
      }
      resolve();
    });
  });
}

export async function monitorEthereumNodeHealth(augur: Augur, errorCallback: ErrorCallback | undefined) {
  const networkId: string = augur.rpc.getNetworkID();
  const addresses = augur.contracts.addresses[networkId];
  if (addresses === undefined) {
    if (errorCallback) throw new Error(`getNetworkID result does not map to a set of contracts: ${networkId}`);
  }
  const universe: string = addresses.Universe;
  const controller: string = addresses.Controller;
  await checkEthereumNodeHealth(augur, universe, controller);
  if (monitorEthereumNodeHealthId) {
    clearInterval(monitorEthereumNodeHealthId);
  }
  monitorEthereumNodeHealthId = setInterval(async () => {
    try {
      await checkEthereumNodeHealth(augur, universe, controller);
    } catch (err) {
      clearInterval(monitorEthereumNodeHealthId);
      if (errorCallback) errorCallback(err);
    }
  }, POLLING_FREQUENCY_IN_MS);
}
