import keythereum from "keythereum";
import { byteArrayToHexString } from "speedomatic";

export default function(address, keystore, privateKey) {
  return {
    accountPrivateKey: byteArrayToHexString(privateKey || ""),
    downloadAccountDataString: `data:,${encodeURIComponent(
      JSON.stringify(keystore)
    )}`,
    downloadAccountFileName: keythereum.generateKeystoreFilename(address)
  };
}
