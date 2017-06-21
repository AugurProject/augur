import keythereum from 'keythereum';
import { augur } from 'services/augurjs';

export default function (address, keystore, loginID, privateKey) {
  return {
    accountPrivateKey: augur.abi.bytes_to_hex(privateKey || ''),
    downloadLoginIDDataString: `data:,${loginID}`,
    downloadLoginIDFileName: `augur-login-id--${address}`,
    downloadAccountDataString: `data:,${encodeURIComponent(JSON.stringify(keystore))}`,
    downloadAccountFileName: keythereum.generateKeystoreFilename(address)
  };
}
