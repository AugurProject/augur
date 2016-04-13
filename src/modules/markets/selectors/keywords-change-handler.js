import memoizerific from 'memoizerific';

import store from '../../../store';

import * as MarketsActions from '../actions/markets-actions';

export default function() {
	return selectKeywordsChangeHandler(store.dispatch);
}

export const selectKeywordsChangeHandler = memoizerific(1)(function(dispatch) {
    return (keywords) => dispatch(MarketsActions.updateKeywords(keywords));
});


