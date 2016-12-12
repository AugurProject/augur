import { assert } from 'chai';

import assertNavItem from './common/nav-item';

export default function (portfolioNavItems){
	describe(`augur-ui-react-components portfolio's navItems state`, () => {
		assert.isDefined(portfolioNavItems);
		assert.isArray(portfolioNavItems);

		portfolioNavItems.forEach(navItem => { assertNavItem(navItem, 'portfolio.navItem') });
	});
};