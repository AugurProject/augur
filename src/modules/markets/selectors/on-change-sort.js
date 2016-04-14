import memoizerific from 'memoizerific';

import store from '../../../store';

import * as MarketsActions from '../actions/markets-actions';

export default function() {
	return selectSelectedSort(store.dispatch);
}

export const selectSelectedSort = memoizerific(1)(function(dispatch) {
    return (prop, isDesc) => {
        var o = {};
        if (prop) {
            o.prop = prop;
        }
        if (isDesc || isDesc === false) {
            o.isDesc = isDesc;
        }
        dispatch(MarketsActions.updateSelectedSort(o));
    };
});


