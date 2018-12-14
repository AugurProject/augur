import assertNavItem from "src/assertions/common/nav-item";

export default function(portfolioNavItems) {
  describe(`portfolio's navItems state`, () => {
    expect(portfolioNavItems).toBeDefined();
    expect(Array.isArray(portfolioNavItems)).toBe(true);

    portfolioNavItems.forEach(navItem => {
      assertNavItem(navItem, "portfolio.navItem");
    });
  });
}
