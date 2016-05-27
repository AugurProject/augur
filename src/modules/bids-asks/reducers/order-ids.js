/*
 * Author: priecint
 */

import { UPDATE_ORDER_IDS } from '../../bids-asks/actions/update-order-ids';

/**
 * 
 * 
 * @param {Object} orderIds
 * @param {Object} action
 * @return {{}} key: marketId, value: array of order IDs
 */
export default function (orderIds = {}, action) {
	switch (action.type) {
		case UPDATE_ORDER_IDS:
			const newOrderIds = {
				...orderIds,
				[action.marketId]: action.orderIds
			};
			return newOrderIds;
			break;
		default:
			return orderIds;
	}
}