import assertComponentNavItem from "src/assertions/common/component-nav";

export default function(marketUserDataNavItems) {
  expect(marketUserDataNavItems).toBeDefined();
  expect(typeof marketUserDataNavItems).toBe("object");

  Object.keys(marketUserDataNavItems).forEach(navItem => {
    assertComponentNavItem(marketUserDataNavItems[navItem], navItem);
  });
}
