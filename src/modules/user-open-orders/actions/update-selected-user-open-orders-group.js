/*
 * Author: priecint
 */
export const UPDATE_SELECTED_USER_OPEN_ORDERS_GROUP = 'UPDATE_SELECTED_USER_OPEN_ORDERS_GROUP';

export default function (selectedUserOpenOrdersGroupID) {
	return {
		type: UPDATE_SELECTED_USER_OPEN_ORDERS_GROUP,
		selectedUserOpenOrdersGroupID
	};
}
