import memoizerific from 'memoizerific';

import store from '../../../store';

export default function() {
    var { selectedSort } = store.getState();
    return selectedSort;
}