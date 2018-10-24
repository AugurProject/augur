import { Augur } from "augur.js";
import { ErrorCallback } from "../types";

const POLLING_FREQUENCY_IN_MS = 5000;

async function checkEthereumNodeHealth(augur: Augur, universe: string, controller: string) {
  try {
    const universeController = await augur.api.Universe.getController({ tx: { to: universe } });
    if (universeController !== controller) {
      throw new Error(`Controller mismatch. Configured: ${controller} Found: ${universeController}`);
    }
  } catch (err) {
    throw (new Error(`Controller Match Lookup Error. Check if universe "${universe}" exists. ${err.message}`));
  }
}

// This should really go on augur.js
function getNetworkAddresses(augur: Augur) {
  const networkId: string = augur.rpc.getNetworkID();
  const addresses = augur.contracts.addresses[networkId];
  if (addresses === undefined) throw new Error(`getNetworkID result does not map to a set of contracts: ${networkId}`);
  return addresses;
}

export async function monitorEthereumNodeHealth(augur: Augur, errorCallback: ErrorCallback | undefined) {
  try {
    const { Universe: universe, Controller: controller } = getNetworkAddresses(augur);
    await checkEthereumNodeHealth(augur, universe, controller);
    setTimeout(() => monitorEthereumNodeHealth(augur, errorCallback), POLLING_FREQUENCY_IN_MS);
  } catch (err) {
    if (errorCallback) errorCallback(err);
  }
}
