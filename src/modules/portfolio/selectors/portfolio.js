import selectPortfolioNavItems from '../../../modules/portfolio/selectors/nav-items';
import selectPortfolioSummaries from '../../../modules/portfolio/selectors/summaries';
import selectLoginAccountMarkets from '../../../modules/my-markets/selectors/login-account-markets';

export default function () {
	const navItems = selectPortfolioNavItems();
	const summaries = selectPortfolioSummaries();
	const loginAccountMarkets = selectLoginAccountMarkets();

	return {
		navItems,
		summaries,
		loginAccountMarkets
	};
}
