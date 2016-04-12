import store from '../../../store';

export default function() {
	var { loginAccount } = store.getState();
	return loginAccount;
}