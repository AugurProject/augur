import { selectPortfolioNavItems } from '../../../modules/portfolio/selectors/nav-items';

export default function () {
	const { links } = require('../../../selectors');

	return {
		navItems: selectPortfolioNavItems(links)
	};
}
