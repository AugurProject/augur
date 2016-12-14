import portfolioNavItems from '../../../modules/portfolio/selectors/portfolio-nav-items';
import selectPortfolioTotals from '../../../modules/portfolio/selectors/portfolio-totals';
import selectLoginAccountPositions from '../../../modules/my-positions/selectors/login-account-positions';
import selectLoginAccountMarkets from '../../../modules/my-markets/selectors/login-account-markets';
import selectLoginAccountReports from '../../../modules/my-reports/selectors/login-account-reports';

export default function () {
	const positions = selectLoginAccountPositions();
	const markets = selectLoginAccountMarkets();
	const reports = selectLoginAccountReports();
	const navItems = portfolioNavItems();
	const totals = selectPortfolioTotals();

	// console.log('loginAccountReports -- ', reports);

	return {
		navItems,
		positions,
		markets,
		reports,
		totals
	};
}
