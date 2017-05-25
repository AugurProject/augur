import keythereum from 'keythereum';

export default function (address, keystore) {
  return {
    downloadAccountDataString: `data:,${encodeURIComponent(JSON.stringify(keystore))}`,
    downloadAccountFileName: keythereum.generateKeystoreFilename(address)
  };
}
