import { describe } from 'mocha';
import { assert } from 'chai';

export default function (loginAccountMarkets) {
	describe(`augur-ui-react-components loginAccountMarket's shape`, () => {
		assert.isDefined(loginAccountMarkets);
		assert.isObject(loginAccountMarkets);
	});
}
