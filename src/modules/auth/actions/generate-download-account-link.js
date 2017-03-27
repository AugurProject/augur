import keythereum from 'keythereum';

export default function (address, keystore) {
  return {
    downloadAccountDataString: `data:,${encodeURIComponent(keystore)}`,
    downloadAccountFilename: keythereum.generateKeystoreFilename(address)
  };
}
