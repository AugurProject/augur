import memoizerific from 'memoizerific';

import { MARKET_TYPES, BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { MARKET_STATUSES, OPEN, RECENTLY_EXPIRED } from '../../markets/constants/market-statuses';

import * as MarketsActions from '../actions/markets-actions';

import store from '../../../store';

export default function() {
	var { selectedFilters } = store.getState();
	return selectFiltersProps(selectedFilters, store.dispatch);
}

export const selectFiltersProps = memoizerific(10)(function(selectedFilters, dispatch) {
    return {
		isCheckedOpen: !!selectedFilters[OPEN],
		isCheckedExpired: !!selectedFilters[RECENTLY_EXPIRED],
		isCheckedBinary: !!selectedFilters[BINARY],
		isCheckedCategorical: !!selectedFilters[CATEGORICAL],
		isCheckedScalar: !!selectedFilters[SCALAR],
		isCheckedCombinatorial: !!selectedFilters[COMBINATORIAL],

		onClickFilterOpen: () => dispatch(MarketsActions.toggleFilter(OPEN)),
		onClickFilterExpired: () => dispatch(MarketsActions.toggleFilter(RECENTLY_EXPIRED)),
		onClickFilterBinary: () => dispatch(MarketsActions.toggleFilter(BINARY)),
		onClickFilterCategorical: () => dispatch(MarketsActions.toggleFilter(CATEGORICAL)),
		onClickFilterScalar: () => dispatch(MarketsActions.toggleFilter(SCALAR)),
		onClickFilterCombinatorial: () => dispatch(MarketsActions.toggleFilter(COMBINATORIAL))
    };
});