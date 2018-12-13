import assertLink from "src/assertions/common/link";

export default function(links) {
  describe("links state", () => {
    expect(links).toBeDefined();
    expect(typeof links).toBe("object");

    test("authLink", () => {
      assertLink(links.authLink, "authLink");
    });

    test("marketsLink", () => {
      assertLink(links.marketsLink, "marketsLink");
    });

    test("transactionsLink", () => {
      assertLink(links.transactionsLink, "transactionsLink");
    });

    test("marketLink", () => {
      assertLink(links.marketLink, "marketLink");
    });

    test("previousLink", () => {
      assertLink(links.previousLink, "previousLink");
    });

    test("createMarketLink", () => {
      assertLink(links.createMarketLink, "createMarketLink");
    });

    test("categorysLink", () => {
      assertLink(links.categorysLink, "categorysLink");
    });
  });
}
