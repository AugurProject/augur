import keythereum from 'keythereum'
import speedomatic from 'speedomatic'

export default function (address, keystore, privateKey) {
  return {
    accountPrivateKey: speedomatic.byteArrayToHexString(privateKey || ''),
    downloadAccountDataString: `data:,${encodeURIComponent(JSON.stringify(keystore))}`,
    downloadAccountFileName: keythereum.generateKeystoreFilename(address),
  }
}
