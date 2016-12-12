import memoizerific from 'memoizerific';
import { updateKeywords } from '../../markets/actions/update-keywords';
import store from '../../../store';

export default function () {
	const { keywords } = store.getState();
	return {
		value: keywords,
		onChangeKeywords: selectOnChangeKeywords(store.dispatch)
	};
}

export const selectOnChangeKeywords = memoizerific(1)(dispatch =>
	keywords => dispatch(updateKeywords(keywords))
);
