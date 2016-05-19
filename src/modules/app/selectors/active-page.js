import store from '../../../store';

export default function () {
	const { activePage } = store.getState();
	return activePage;
}
