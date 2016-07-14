import { emptyNumber } from '../utils/empty-number';

const loginAccount = {
	address: '0x45a153fdd97836c2b349a5f53970dc44b0ef1efa',
	id: '0x45a153fdd97836c2b349a5f53970dc44b0ef1efa',
	secureLoginID: 'testID123ASDW3N193NF7V123ADW25579130239SE1235189ADJWKRUY8123AOUELOREMIPSUMDOLORSITAMETCONSECTETURADIPISICINGELITSEDDOEIUSMODTEMPORINCIDIDUNTUTLABOREETDOLOREMAGNAALIQUAUTENIMADMINIMVENIAMQUISNOSTRUDEXERCITATIONULLAMCOLABORISNISIUTALIQUIPEXEACOMMODOCONSEQUATDUISAUTEIRUREDOLORINREPREHENDERITINVOLUPTATEVELITESSECILLUMDOLOREEUFUGIATNULLAPARIATUREXCEPTEURSINTOCCAECATCUPIDATATNONPROIDENTSUNTINCULPAQUIOFFICIADESERUNTMOLLITANIMIDESTLABORUM',
	prettySecureLoginID: 'test...ORUM',
	rep: emptyNumber('rep'),
	ether: emptyNumber('eth'),
	realEther: emptyNumber('eth'),
	name: 'MrTestTesterson'
};

loginAccount.linkText = loginAccount.name || loginAccount.prettySecureLoginID;

loginAccount.signIn = (name = loginAccount.name) => {
	loginAccount.update({ loginAccount: {
		...loginAccount,
		name,
		update: loginAccount.update,
		editName: loginAccount.editName,
		signOut: loginAccount.signOut
	}
	});
	loginAccount.editName(name);
};

loginAccount.editName = (name) => {
	loginAccount.name = (name && name !== '') ? name : undefined;
	loginAccount.linkText = loginAccount.name || loginAccount.prettySecureLoginID;
};

loginAccount.signIn = (name = loginAccount.name) => {
	loginAccount.update({ loginAccount: {
		...loginAccount,
		name,
		update: loginAccount.update,
		editName: loginAccount.editName,
		signOut: loginAccount.signOut
	}
	});
	loginAccount.editName(name);
};

loginAccount.signOut = () => {
	loginAccount.update({
		loginAccount: {
			update: loginAccount.update,
			signIn: loginAccount.signIn
		}
	});
};

export default loginAccount;
