import assertComponentNavItem from "assertions/common/component-nav";

export default function(marketDataNavItems) {
  expect(marketDataNavItems).toBeDefined();
  expect(typeof marketDataNavItems).toBe("object");

  Object.keys(marketDataNavItems).forEach(navItem => {
    assertComponentNavItem(marketDataNavItems[navItem], navItem);
  });
}
