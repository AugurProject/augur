import { augur } from '../../../services/augurjs';

export function encryptReport(report, encryptionKey, salt) {
  const encrypted = { report: 0, salt: 0 };
  if (encryptionKey) {
    encrypted.report = augur.encryptReport(report, encryptionKey, salt);
    encrypted.salt = augur.encryptReport(salt, encryptionKey);
    console.debug('encrypted report:', encrypted);
  }
  return encrypted;
}

export function decryptReport(branchID, period, eventID, callback) {
  if (!augur.accounts.account.derivedKey) return callback(null);
  augur.getAndDecryptReport(branchID, period, augur.accounts.account.address, eventID, {
    derivedKey: augur.accounts.account.derivedKey
  }, (plaintext) => {
    if (!plaintext) return callback('getAndDecryptReport failed');
    if (!plaintext.report || plaintext.error) {
      return callback(plaintext);
    }
    callback(null, {
      reportedOutcomeID: !parseInt(plaintext.report, 16) ? null : plaintext.report,
      salt: parseInt(plaintext.salt, 16) === 0 ? null : plaintext.salt,
      isUnethical: parseInt(plaintext.ethics, 16) === 0
    });
  });
}
