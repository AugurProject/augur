import assertLink from "assertions/common/link";

export default function(navItem, label = "Nav Item") {
  describe(`${label}' Shape`, () => {
    expect(navItem).toBeDefined();
    expect(typeof navItem).toBe("object");

    test("label", () => {
      expect(navItem.label).toBeDefined();
      expect(typeof navItem.label).toBe("string");
    });

    test("link", () => {
      assertLink(navItem.link, "portfolio.navItem.link");
    });

    test("page", () => {
      expect(navItem.page).toBeDefined();
      expect(typeof navItem.page).toBe("string");
    });
  });
}
