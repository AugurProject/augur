import keythereum from 'keythereum';

export default function (address, keystore) {
  const stringifiedKeystore = JSON.stringify(keystore);

  return {
    stringifiedKeystore,
    downloadAccountDataString: `data:,${encodeURIComponent(stringifiedKeystore)}`,
    downloadAccountFileName: keythereum.generateKeystoreFilename(address)
  };
}
