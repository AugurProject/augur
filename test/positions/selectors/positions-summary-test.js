import * as selector from '../../../src/modules/positions/selectors/positions-summary';
import { assertions } from 'augur-ui-react-components';

describe(`modules/positions/selectors/positions-summary.js`, () => {
	let expected, actual;

	it(`should return a summary of positions`, () => {
		let numPositions = 100;
		let qtyShares = 500;
		let totalValue = 1000;
		let totalCost = 10000;
		let positions = 50;

		actual = selector.selectPositionsSummary(numPositions, qtyShares, totalValue, totalCost, positions);

		assertions.marketsTotals.positionsSummaryAssertion(actual);
	});
});
