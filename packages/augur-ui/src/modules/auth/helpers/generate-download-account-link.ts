import { byteArrayToHexString } from "@augurproject/utils";

export default function(address, keystore, privateKey) {
  return {
    accountPrivateKey: byteArrayToHexString(privateKey || ""),
    downloadAccountDataString: `data:,${encodeURIComponent(
      JSON.stringify(keystore)
    )}`
  };
}
