import { augur } from 'services/augurjs'
import secureRandom from 'secure-random'
import keythereum from 'keythereum'

export default function (password, privateKey, callback) {
  const salt = new Buffer(secureRandom(32))
  const iv = new Buffer(secureRandom(16))
  const options = { kdf: augur.constants.KDF }
  keythereum.dump(password, privateKey, salt, iv, options, callback)
}
