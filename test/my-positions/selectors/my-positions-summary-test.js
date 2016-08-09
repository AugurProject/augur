import * as selector from '../../../src/modules/my-positions/selectors/my-positions-summary';
import { assertions } from 'augur-ui-react-components';

describe(`modules/my-positions/selectors/my-positions-summary.js`, () => {
	let actual;

	it(`should return a summary of positions`, () => {
		let numPositions = 100;
		let qtyShares = 500;
		let totalValue = 1000;
		let totalCost = 10000;
		let positions = 50;

		actual = selector.generatePositionsSummary(numPositions, qtyShares, totalValue, totalCost);

		assertions.positionsSummary(actual);
	});
});
