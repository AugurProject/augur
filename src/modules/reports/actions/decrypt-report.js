import { augur } from '../../../services/augurjs';

export function decryptReport(loginAccount, branchID, period, eventID, callback) {
	if (!loginAccount.derivedKey) return callback(null);
	augur.getAndDecryptReport(branchID, period, loginAccount.address, eventID, {
		derivedKey: loginAccount.derivedKey,
		salt: loginAccount.keystore.crypto.kdfparams.salt
	}, (plaintext) => {
		if (!plaintext) return callback('getAndDecryptReport failed');
		if (!plaintext.report || plaintext.error) {
			return callback(plaintext);
		}
		callback(null, {
			reportedOutcomeID: plaintext.report === '0' ? null : plaintext.report,
			salt: parseInt(plaintext.salt, 16) === 0 ? null : plaintext.salt,
			isUnethical: parseInt(plaintext.ethics, 16) === 0
		});
	});
}
