

import assertComponentNavItem from 'assertions/common/component-nav'

export default function (marketUserDataNavItems) {
  assert.isDefined(marketUserDataNavItems, `marketUserDataNavItems isn't defined`)
  assert.isObject(marketUserDataNavItems, `marketUserDataNavItems isn't an object`)

  Object.keys(marketUserDataNavItems).forEach((navItem) => {
    assertComponentNavItem(marketUserDataNavItems[navItem], navItem)
  })
}
