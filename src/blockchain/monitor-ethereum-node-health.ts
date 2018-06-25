import { Augur } from "augur.js";

let monitorEthereumNodeHealthId: NodeJS.Timer;

export function monitorEthereumNodeHealth(augur: Augur) {
  const networkId: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkId].Universe;
  const controller: string = augur.contracts.addresses[networkId].Controller;
  if (monitorEthereumNodeHealthId) {
    clearInterval(monitorEthereumNodeHealthId);
  }
  monitorEthereumNodeHealthId = setInterval(() => {
    augur.api.Universe.getController({ tx: { to: universe } }, (err: Error, universeController: string) => {
      if (err) throw err;
      if (universeController !== controller) {
        throw new Error(`Controller mismatch. Configured: ${controller} Found: ${universeController}`);
      }
    });
  }, 5000);
}
