import keythereum from 'keythereum';
import { augur } from 'services/augurjs';

import getValue from 'utils/get-value';

export default function (address, keystore, loginID) {
  return {
    accountPrivateKey: augur.abi.bytes_to_hex(getValue(augur, 'accounts.account.privateKey') || ''),
    downloadLoginIDDataString: `data:,${loginID}`,
    downloadLoginIDFileName: `augur-login-id--${address}`,
    downloadAccountDataString: `data:,${encodeURIComponent(JSON.stringify(keystore))}`,
    downloadAccountFileName: keythereum.generateKeystoreFilename(address)
  };
}
