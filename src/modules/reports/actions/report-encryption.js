import { augur } from 'services/augurjs';

export const encryptReport = (report, salt) => {
  const encryptionKey = augur.accounts.account.derivedKey;
  const encrypted = { report: 0, salt: 0 };
  if (encryptionKey) {
    encrypted.report = augur.encryptReport(report, encryptionKey, salt);
    encrypted.salt = augur.encryptReport(salt, encryptionKey);
  }
  return encrypted;
};

export const decryptReport = (branchID, period, eventID, callback) => {
  const { address, derivedKey } = augur.accounts.account;
  if (!derivedKey) return callback(null);
  augur.getAndDecryptReport(branchID, period, address, eventID, { derivedKey }, (plaintext) => {
    if (!plaintext) return callback('getAndDecryptReport failed');
    if (!plaintext.report || plaintext.error) return callback(plaintext);
    callback(null, {
      reportedOutcomeID: !parseInt(plaintext.report, 16) ? null : plaintext.report,
      salt: parseInt(plaintext.salt, 16) === 0 ? null : plaintext.salt,
      isUnethical: parseInt(plaintext.ethics, 16) === 0
    });
  });
};
