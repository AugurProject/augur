import assertComponentNavItem from "assertions/common/component-nav";

export default function(marketReportingNavItems) {
  expect(marketReportingNavItems).toBeDefined();
  expect(typeof marketReportingNavItems).toBe("object");

  Object.keys(marketReportingNavItems).forEach(navItem => {
    assertComponentNavItem(marketReportingNavItems[navItem], navItem);
  });
}
