

import assertComponentNavItem from 'assertions/common/component-nav'

export default function (marketReportingNavItems) {
  assert.isDefined(marketReportingNavItems, `marketReportingNavItems isn't defined`)
  assert.isObject(marketReportingNavItems, `marketReportingNavItems isn't an object`)

  Object.keys(marketReportingNavItems).forEach((navItem) => {
    assertComponentNavItem(marketReportingNavItems[navItem], navItem)
  })
}
