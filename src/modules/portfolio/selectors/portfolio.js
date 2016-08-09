import selectPortfolioNavItems from '../../../modules/portfolio/selectors/portfolio-nav-items';
import selectPortfolioTotals from '../../../modules/portfolio/selectors/portfolio-totals';
import selectLoginAccountPositions from '../../../modules/my-positions/selectors/login-account-positions';
import selectLoginAccountMarkets from '../../../modules/my-markets/selectors/login-account-markets';

export default function () {
	const positions = selectLoginAccountPositions();
	const markets = selectLoginAccountMarkets();
	const navItems = selectPortfolioNavItems();
	const totals = selectPortfolioTotals();

	return {
		navItems,
		positions,
		markets,
		totals
	};
}
