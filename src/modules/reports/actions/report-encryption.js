import { augur } from 'services/augurjs'

export const encryptReport = (report, salt) => (dispatch, getState) => {
  const encryptionKey = getState().loginAccount.derivedKey
  const encrypted = { report: 0, salt: 0 }
  if (encryptionKey) {
    encrypted.report = augur.reporting.crypto.encryptReport(report, encryptionKey, salt)
    encrypted.salt = augur.reporting.crypto.encryptReport(salt, encryptionKey)
  }
  return encrypted
}

export const decryptReport = (branchID, period, eventID, callback) => (dispatch, getState) => {
  const { address, derivedKey } = getState().loginAccount
  if (!derivedKey) return callback(null)
  augur.reporting.crypto.getAndDecryptReport(branchID, period, address, eventID, { derivedKey }, (plaintext) => {
    if (!plaintext) return callback('getAndDecryptReport failed')
    if (!plaintext.report || plaintext.error) return callback(plaintext)
    callback(null, {
      reportedOutcomeID: !parseInt(plaintext.report, 16) ? null : plaintext.report,
      salt: parseInt(plaintext.salt, 16) === 0 ? null : plaintext.salt,
      isUnethical: parseInt(plaintext.ethics, 16) === 0
    })
  })
}
