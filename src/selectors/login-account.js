import { emptyNumber } from '../utils/empty-number';

const loginAccount = {
	address: '0x45a153fdd97836c2b349a5f53970dc44b0ef1efa',
	id: '0x45a153fdd97836c2b349a5f53970dc44b0ef1efa',
	prettySecureLoginID: '0x45...1efa',
	rep: emptyNumber('rep'),
	ether: emptyNumber('eth'),
	realEther: emptyNumber('eth'),
	name: 'MrTestTesterson',
	keystore: {
		address: '0x45a153fdd97836c2b349a5f53970dc44b0ef1efa',
		id: 'eff3a9a1-df84-4d1a-ac8d-8aac2a6c26a5',
		version: 3,
		crypto: {
			cipher: 'aes-128-ctr',
			cipherparams: {
				iv: 'a5e8632c15434d22e4a8401ce0f12152'
			},
			ciphertext: 'e1e1f574f3314da326ba0d104cbea23b41324736ea28018632c132b4db23f75a',
			kdf: 'pbkdf2',
			kdfparams: {
				c: 65536,
				dklen: 32,
				pdf: 'hmac-sha256',
				salt: '7a61fd89dc32b9c92769085834c917e2a3804bc9016b882231ad2753d62b19b6'
			},
			mac: '87a4c308d3284a2107ecf8dde56497dd1a5f50eef4734914b557d0f184ed5bba'
		}
	},
	privateKey: [
		18, 25, 35, 127, 205, 40, 214, 177, 59, 82, 250, 244, 101, 100, 107, 188, 55, 101, 210, 253, 107, 222, 86, 255, 249, 83, 8, 233, 44, 46, 74, 121
	]
};

loginAccount.linkText = loginAccount.name || loginAccount.prettySecureLoginID;

loginAccount.editName = (name) => {
	loginAccount.name = (name && name !== '') ? name : undefined;
	loginAccount.linkText = loginAccount.name || loginAccount.prettySecureLoginID;
};

loginAccount.onChangePass = (password, newPassword, newPassword2) => console.log(`Password: ${password}.`, `New Password: ${newPassword}.`, `Confirmed New Password: ${newPassword2}.`, 'This function would trigger a password change in Augur + validation.');

export default loginAccount;
