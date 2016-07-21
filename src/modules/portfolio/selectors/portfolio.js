import { selectPortfolioNavItems } from '../../../modules/portfolio/selectors/nav-items';
import { selectPortfolioSummaries } from '../../../modules/portfolio/selectors/summaries';

export default function () {
	const { links } = require('../../../selectors');

	const navItems = selectPortfolioNavItems(links);
	const summaries = selectPortfolioSummaries();

	return {
		navItems,
		summaries
	};
}
