import { assert } from 'chai';

import assertFormattedNumber from '../../test/assertions/common/formatted-number';

export default function (portfolioTotals){
	describe(`augur-ui-react-components portfolioTotals' shape`, () => {
		assert.isDefined(portfolioTotals);
		assert.isObject(portfolioTotals);

		it('net', () => {
			assert.isDefined(portfolioTotals.netChange);
			assertFormattedNumber(portfolioTotals.netChange, 'portfolio.totals.netChange');
		});
	});
};