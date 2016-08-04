import { assert } from 'chai';

import assertFormattedNumber from '../../test/assertions/common/formatted-number';

export default function (portfolioTotals){
	describe(`augur-ui-react-components portfolioTotals' shape`, () => {
		assert.isDefined(portfolioTotals);
		assert.isObject(portfolioTotals);

		it('value', () => {
			assert.isDefined(portfolioTotals.value);

			assertFormattedNumber(portfolioTotals.value, 'portfolio.totals.value');
		});

		it('net', () => {
			assert.isDefined(portfolioTotals);

			assertFormattedNumber(portfolioTotals.net, 'portfolio.totals.net');
		});
	});
};