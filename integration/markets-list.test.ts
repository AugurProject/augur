import "jest-environment-puppeteer";
import {UnlockedAccounts} from "./constants/accounts";

const url = `${process.env.AUGUR_URL}#/markets`;

jest.setTimeout(100000);

describe("Markets List", () => {
  beforeAll(async () => {
    await page.goto(url);

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });

    await page.evaluate((marketDescription) => window.integrationHelpers.findMarketId(marketDescription), 'Will Ethereum trade at $2000 or higher at any time before the end of 2018?');
    await page.waitForSelector("div.modal-disclaimer-styles_ModalDisclaimer__ActionButtons")
    await expect(page).toClick("button", {
      text: "I have read and understand the above"
    });
    await page.waitForSelector("aside.side-nav-styles_SideNav")
  });

  describe("General View", () => {

    it("should paginate in chunks of 10", async () => {
      await page.waitForSelector(".markets-list")
      const markets = await page.$$(".market-common-styles_MarketCommon__container")
      expect(markets.length).toEqual(10);
    });

    it("should display one submenu in the sidebar", async () => {
    });

    it("should display all categories for every loaded market in the sidebar", async () => {
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main")
      const marketCategories = await page.$$(".inner-nav-styles_InnerNav__menu-item--visible")
      expect(marketCategories.length).toEqual(12);
    });

    describe("Market Cards", () => {
      beforeAll(async () => {
        const markets = await page.$$(".market-common-styles_MarketCommon__container")
        const yesNoMarket = markets[0] // yes/no market
      });

      it("should display market title", async () => {
        expect(await yesNoMarket.$eval('a', node => node.innerText)).toBe('Will Ethereum trade at $2000 or higher at any time before the end of 2018?');

        // display a scale with the current mid-price for the market.
        // verify the mid-price display is accurate and that the midprice moves along the scale appropriately. Test this for binary and scalar markets, and with something other than the default value (place some trades).
      });
    });
  });

  describe("Filtering", () => {
    beforeAll(async () => {
      // click on crypto category
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main")
      await expect(page).toClick("a[href$='#/markets?category=crypto']")
    });

    it("should correctly redirect after category click", async () => {

      // check that url is correct
      const pageUrl = await page.evaluate(() => location.href);
      expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/markets?category=crypto`)
    });

    it("should slide out the second submenu bar", async () => {
    });

    it("should filter market cards", async () => {

      // check that header is correct
      const headerWrapper = await page.$('div.markets-header-styles_MarketsHeader__wrapper');
      expect(await headerWrapper.$eval('h1', node => node.innerText)).toBe('CRYPTO');

      // check that markets listed are correct
      const markets = await page.$$(".market-common-styles_MarketCommon__container")
      expect(markets.length).toEqual(2);

      // check that markets listed are in the selected category
    });

    it("should filter out markets that don't match the selected tags", async () => {
    });

    it("should show all markets after clicking the market button", async () => {
    });
  });

  describe("Search", () => {
     beforeAll(async () => {
      // click on search bar on top of the page
      // enter in a keyword to search for
    });

    it("should filter markets to show only ones with searched keyword", async () => {
    });

    it("should clear search and show all markets after clearing the search", async () => {
    });

    it("should not have case sensitive search", async () => {
    });

    it("should have markets be searchable by title, tag, or category", async () => {
    });
  });
});
