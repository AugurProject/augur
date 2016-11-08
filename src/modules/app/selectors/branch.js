import store from '../../../store';

export default function () {
	const { branch } = store.getState();
	return branch;
}
