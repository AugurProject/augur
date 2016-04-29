/**
 * Author: priecint
 */
import memoizerific from 'memoizerific';

import { updateKeywords } from '../../markets/actions/update-keywords';

import store from '../../../store';

export default function() {
    var { keywords } = store.getState();
    return {
        value: keywords,
        onChangeKeywords: selectOnChangeKeywords(store.dispatch)
    };
}

export const selectOnChangeKeywords = memoizerific(1)(function(dispatch) {
    return (keywords) => dispatch(updateKeywords(keywords));
});