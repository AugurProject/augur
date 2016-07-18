/*
 * Author: priecint
 */
export const UPDATE_SELECTED_USER_OPEN_ORDERS_GROUP = 'UPDATE_SELECTED_USER_OPEN_ORDERS_GROUP';

export default function (selectedUserOpenOrdersGroup) {
	return {
		type: UPDATE_SELECTED_USER_OPEN_ORDERS_GROUP,
		selectedUserOpenOrdersGroup
	};
}
