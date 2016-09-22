/*
 * Author: priecint
 */

export const TICK = 'TICK';

export default function () {
	return (dispatch, getState) => {
		setInterval(() => {
			dispatch({
				type: TICK,
				now: new Date().getTime()
			});
		}, 1000);
	}
}
