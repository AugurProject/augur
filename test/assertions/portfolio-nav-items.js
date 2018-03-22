

import assertNavItem from 'assertions/common/nav-item'

export default function (portfolioNavItems) {
  describe(`portfolio's navItems state`, () => {
    assert.isDefined(portfolioNavItems)
    assert.isArray(portfolioNavItems)

    portfolioNavItems.forEach((navItem) => { assertNavItem(navItem, 'portfolio.navItem') })
  })
}
