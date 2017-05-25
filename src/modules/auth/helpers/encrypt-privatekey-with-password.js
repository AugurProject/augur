import secureRandom from 'secure-random';
import keythereum from 'keythereum';
import { augur } from 'services/augurjs';

export default function (password, callback) {
  const privateKey = augur.accounts.account.privateKey;
  const salt = new Buffer(secureRandom(32));
  const iv = new Buffer(secureRandom(16));
  const options = { kdf: augur.constants.kdf };
  keythereum.dump(password, privateKey, salt, iv, options, callback);
}
