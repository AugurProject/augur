import memoizerific from 'memoizerific';
import store from '../../../store';

export default function() {
	var { selectedMarketID, tradesInProgress } = store.getState();
	return tradesInProgress[selectedMarketID];
}