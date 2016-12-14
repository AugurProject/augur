import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as selector from 'modules/my-positions/selectors/my-positions-summary';
import positionsSummaryAssertions from 'assertions/positions-summary';
import { abi } from 'services/augurjs';

describe(`modules/my-positions/selectors/my-positions-summary.js`, () => {
	it(`should return a summary of positions`, () => {
		const randomNum = () => abi.bignum(Math.random() * 10);
		const numPositions = randomNum();
		const qtyShares = randomNum();
		const meanTradeValue = randomNum();
		const realizedNet = randomNum();
		const unrealizedNet = randomNum();

		const actual = selector.generatePositionsSummary(numPositions, qtyShares, meanTradeValue, realizedNet, unrealizedNet);

		assert.isDefined(actual);  // TOOD -- tmp placeholder

		positionsSummaryAssertions(actual);
	});
});
