import store from '../../../store';

export default function () {
	const { url } = store.getState();
	return url;
}
