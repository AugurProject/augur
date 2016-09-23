/*
 * Author: priecint
 */

export const TICK = 'TICK';

const TICK_MILLIS = 1000;

export default function () {
	return (dispatch, getState) => {
		setInterval(() => {
			dispatch({
				type: TICK,
				meta: {
					ignore: true
				},
				now: new Date().getTime()
			});
		}, TICK_MILLIS);
	}
}
