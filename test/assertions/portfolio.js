import { describe } from 'mocha';
import { assert } from 'chai';

export default function (portfolio) {
	describe('augur-ui-react-components portfolio state', () => {
		assert.isDefined(portfolio);
		assert.isObject(portfolio);
	});
}
