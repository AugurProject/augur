import store from '../../../store';

export default function() {
	var { activePage } = store.getState();
	return activePage;
}