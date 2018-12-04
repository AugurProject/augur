import speedomatic from "speedomatic";
import { augur } from "services/augurjs";
// import isAddress from "modules/auth/helpers/is-address";

export default function getEtherBalance(address, callback) {
  /* if (!isAddress(address)) {
    console.error(address, "is not an address");
    return null;
  } */
  // todo: work to be done on is-address // 0x3b583BC3f9Dc1A0310c54E93B2D3Bb70Db9a4216 failed check
  augur.rpc.eth.getBalance([address, "latest"], (err, attoEtherBalance) => {
    if (err) return callback(err);
    const etherBalance = speedomatic.unfix(attoEtherBalance, "string");
    callback(null, etherBalance, address);
  });
}
