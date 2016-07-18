import { UPDATE_SELECTED_USER_OPEN_ORDERS_GROUP } from '../actions/update-selected-user-open-orders-group';

export default (selectedUserOpenOrdersGroup = null, action) => {
	switch (action.type) {
	case UPDATE_SELECTED_USER_OPEN_ORDERS_GROUP:
		return action.selectedUserOpenOrdersGroup;
	default:
		return selectedUserOpenOrdersGroup;
	}
};

