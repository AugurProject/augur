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

export const decryptReport = (branchId, period, eventId, callback) => (dispatch, getState) => {
  const { address, derivedKey } = getState().loginAccount
  if (!derivedKey) return callback(null)
  augur.reporting.crypto.getAndDecryptReport(branchId, period, address, eventId, { derivedKey }, (plaintext) => {
    if (!plaintext) return callback('getAndDecryptReport failed')
    if (!plaintext.report || plaintext.error) return callback(plaintext)
    callback(null, {
      reportedOutcomeId: !parseInt(plaintext.report, 16) ? null : plaintext.report,
      salt: parseInt(plaintext.salt, 16) === 0 ? null : plaintext.salt,
      isUnethical: parseInt(plaintext.ethics, 16) === 0,
    })
  })
}
