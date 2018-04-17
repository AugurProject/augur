

import assertComponentNavItem from 'assertions/common/component-nav'

export default function (marketDataNavItems) {
  assert.isDefined(marketDataNavItems, `marketDataNavItems isn't defined`)
  assert.isObject(marketDataNavItems, `marketDataNavItems isn't an object`)

  Object.keys(marketDataNavItems).forEach((navItem) => {
    assertComponentNavItem(marketDataNavItems[navItem], navItem)
  })
}
