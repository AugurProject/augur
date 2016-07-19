import { assert } from 'chai';

export default function (cancelOrder) {
	describe('augur-ui-react-components cancelOrder', () => {
		it('should exist', () => {
			assert.isFunction(cancelOrder, `cancelOrder is not function.`);
		});
	});
};
