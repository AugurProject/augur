import * as selector from '../../../src/modules/my-positions/selectors/my-positions-summary';
import assertions from 'augur-ui-react-components/lib/assertions';
import { abi } from '../../../src/services/augurjs';

describe(`modules/my-positions/selectors/my-positions-summary.js`, () => {
	let actual;

	const randomNum = () => abi.bignum(Math.random() * 10);

	it(`should return a summary of positions`, () => {
		let numPositions = randomNum();
		let qtyShares = randomNum();
		let totalValue = randomNum();
		let totalCost = randomNum();
		let realizedNet = randomNum();
		let unrealizedNet = randomNum();

		actual = selector.generatePositionsSummary(numPositions, qtyShares, totalValue, totalCost, realizedNet, unrealizedNet);

		assertions.positionsSummary(actual);
	});
});
