/*
 * Author: priecint
 */

import { TICK } from '../../app/actions/init-timer';

export default function (now = new Date().getTime(), action) {
	switch (action.type) {
		case TICK:
			return action.now;

		default:
			return now
	}
}
