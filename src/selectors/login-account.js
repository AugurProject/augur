import { makeNumber } from '../utils/make-number';

const loginAccount = {
	address: '0x45a153fdd97836c2b349a5f53970dc44b0ef1efa',
	id: '0x45a153fdd97836c2b349a5f53970dc44b0ef1efa',
	prettyAddress: '45a1...1efa',
	localNode: false,
	loginID: 'testID123ASDW3N193NF7V123ADW25579130239SE1235189ADJWKRUY8123AOUELOREMIPSUMDOLORSITAMETCONSECTETURADIPISICINGELITSEDDOEIUSMODTEMPORINCIDIDUNTUTLABOREETDOLOREMAGNAALIQUAUTENIMADMINIMVENIAMQUISNOSTRUDEXERCITATIONULLAMCOLABORISNISIUTALIQUIPEXEACOMMODOCONSEQUATDUISAUTEIRUREDOLORINREPREHENDERITINVOLUPTATEVELITESSECILLUMDOLOREEUFUGIATNULLAPARIATUREXCEPTEURSINTOCCAECATCUPIDATATNONPROIDENTSUNTINCULPAQUIOFFICIADESERUNTMOLLITANIMIDESTLABORUM',
	prettyLoginID: 'test...ORUM',
	rep: makeNumber(47, ' REP'),
	ether: makeNumber(10000, ' ETH'),
	realEther: makeNumber(2.5, ' ETH'),
	name: 'MrTestTesterson'
};

loginAccount.linkText = loginAccount.localNode ? loginAccount.prettyAddress : loginAccount.name || loginAccount.prettySecureLoginID;
const date = new Date()
	.toISOString()
	.split(':')
	.join('-');
loginAccount.downloadAccountDataString = `data:,${encodeURIComponent(JSON.stringify(loginAccount))}`;
loginAccount.downloadAccountFileName = `UTC--${date}--${loginAccount.address}`;

loginAccount.signIn = (name = loginAccount.name) => {
	require('../selectors').update({ loginAccount: {
		...loginAccount,
		name,
		editName: loginAccount.editName,
		transferFunds: loginAccount.transferFunds,
		signOut: loginAccount.signOut
	}
	});
	loginAccount.editName(name);
};

loginAccount.editName = (name) => {
	loginAccount.name = (name && name !== '') ? name : undefined;
	loginAccount.linkText = loginAccount.name || loginAccount.prettySecureLoginID;
};

loginAccount.transferFunds = (amount, currency, to) => {
	console.log(`Sending ${amount} ${currency} to: ${to}`);
};

loginAccount.signIn = (name = loginAccount.name) => {
	require('../selectors').update({ loginAccount: {
		...loginAccount,
		name,
		editName: loginAccount.editName,
		transferFunds: loginAccount.transferFunds,
		signOut: loginAccount.signOut
	}
	});
	loginAccount.editName(name);
};

loginAccount.signOut = () => {
	require('../selectors').update({
		loginAccount: {
			signIn: loginAccount.signIn
		}
	});
};

export default loginAccount;
