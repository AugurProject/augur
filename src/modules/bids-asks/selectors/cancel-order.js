/*
 * Author: priecint
 */

import store from '../../../store';
import { cancelOrder } from '../../bids-asks/actions/cancel-order';

export default function () {
	return (orderId, marketID, type) => {
		store.dispatch(cancelOrder(orderId, marketID, type));
	};
}
