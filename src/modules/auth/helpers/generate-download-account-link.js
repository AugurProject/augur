import keythereum from 'keythereum';
import { augur } from 'services/augurjs';

import getValue from 'utils/get-value';

export default function (address, keystore) {
  return {
    accountPrivateKey: augur.abi.bytes_to_hex(getValue(augur, 'accounts.account.privateKey') || ''),
    downloadAccountDataString: `data:,${encodeURIComponent(JSON.stringify(keystore))}`,
    downloadAccountFileName: keythereum.generateKeystoreFilename(address)
  };
}
