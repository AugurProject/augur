/*
 * Author: priecint
 */
import { assert } from 'chai';

export default function(importantInformation) {
	xdescribe('augur-ui-react-components important information', () => {
		it('important information', () => {
			assert.isDefined(importantInformation);
			assert.isObject(importantInformation);
		});
	});
}
