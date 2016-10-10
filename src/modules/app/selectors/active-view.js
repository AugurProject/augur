import store from '../../../store';

export default function () {
	const { activeView } = store.getState();
	return activeView;
}
