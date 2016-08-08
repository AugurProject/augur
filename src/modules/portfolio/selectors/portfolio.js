import selectPortfolioNavItems from './portfolio-nav-items';
import selectPortfolioTotals from '../../../modules/portfolio/selectors/portfolio-totals';

export default function () {
	const { loginAccountPositions, loginAccountMarkets } = require('../../../selectors');

	const positions = loginAccountPositions;
	const markets = loginAccountMarkets;
	const navItems = selectPortfolioNavItems();
	const totals = selectPortfolioTotals();

	// console.log('positions -- ', positions);
	//
	// console.log('markets -- ', markets);

	return {
		navItems,
		positions,
		markets,
		totals
	};
}
