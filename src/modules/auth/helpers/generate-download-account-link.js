import keythereum from 'keythereum';
import { augur } from 'services/augurjs';

export default function (address, keystore, privateKey) {
  return {
    accountPrivateKey: augur.abi.bytes_to_hex(privateKey || ''),
    downloadAccountDataString: `data:,${encodeURIComponent(JSON.stringify(keystore))}`,
    downloadAccountFileName: keythereum.generateKeystoreFilename(address)
  };
}
