/*
 * Author: priecint
 */
// import * as augurJS from '../../../services/augurjs';

// export const CANCEL_ORDER = 'CANCEL_ORDER';

export default function (orderId) {
	return (dispatch, getState) => {
		console.log('todo cancelling %o', orderId);
	};
}
