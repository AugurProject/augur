/*
 * Author: priecint
 */
import { assert } from 'chai';

export default function(loginMessage) {
	xdescribe('augur-ui-react-components login message', () => {
		it('login message', () => {
			assert.isDefined(loginMessage);
			assert.isObject(loginMessage);
		});
	});
}
