import selectPortfolioNavItems from '../../../modules/portfolio/selectors/nav-items';
import selectPortfolioSummaries from '../../../modules/portfolio/selectors/summaries';
import selectMyMarkets from '../../../modules/portfolio/selectors/my-markets';

export default function () {
	const navItems = selectPortfolioNavItems();
	const summaries = selectPortfolioSummaries();
	const myMarkets = selectMyMarkets();

	return {
		navItems,
		summaries,
		myMarkets
	};
}
