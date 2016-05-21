// import memoizerific from 'memoizerific';
import store from '../../../store';

export default function () {
	const { selectedMarketID, tradesInProgress } = store.getState();
	return tradesInProgress[selectedMarketID];
}
