/*
 * Author: priecint
 */
import memoizerific from 'memoizerific';
import store from '../../../store';
import updateSelectedUserOpenOrdersGroup from '../../user-open-orders/actions/update-selected-user-open-orders-group';

export default function () {
	return {
		selectedUserOpenOrdersGroupID: store.getState().selectedUserOpenOrdersGroupID,
		updateSelectedUserOpenOrdersGroup: selectUpdateSelectedUserOpenOrdersGroup(store.dispatch)
	};
}

const selectUpdateSelectedUserOpenOrdersGroup = memoizerific(1)((dispatch) => (
	outcomeId => dispatch(updateSelectedUserOpenOrdersGroup(outcomeId))
));
