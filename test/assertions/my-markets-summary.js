import { assert } from 'chai';

export default function (myMarketsSummary){
	describe(`augur-ui-react-components myMarketsSummary's shape`, () => {
		assert.isDefined(myMarketsSummary);
		assert.isObject(myMarketsSummary);

		assertMyMarketsSummary(myMarketsSummary);
	});
};

export function assertMyMarketsSummary(summary){
	describe(`summary's shape`, () => {
		assert.isDefined(summary);
		assert.isObject(summary);

		it('numMarkets', () => {
			assert.isDefined(summary.numMarkets);
			assert.isNumber(summary.numMarkets);
		});
	});
};
