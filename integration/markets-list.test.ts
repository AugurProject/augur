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

    const marketId = await page.evaluate((marketDescription) => window.integrationHelpers.findMarketId(marketDescription), 'Will antibiotics be outlawed for agricultural use in China by the end of 2019?');

    await page.waitForSelector("div.modal-disclaimer-styles_ModalDisclaimer__ActionButtons")

    await expect(page).toClick("button", {
      text: "I have read and understand the above"
    });

    await page.waitForSelector("aside.side-nav-styles_SideNav")
  });

  it("should paginate in chunks of 10", async () => {
    await page.waitForSelector(".markets-list")
    const markets = await page.$$(".market-common-styles_MarketCommon__container")
    expect(markets.length).toEqual(10);

    // check that bottom equals 20
  });

  it("should display one submenu with categories", async () => {
  });

  it("should display all categories for every loaded market in the sidebar submenu", async () => {
    await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main")
    const marketCategories = await page.$$(".inner-nav-styles_InnerNav__menu-item--visible")
    expect(marketCategories.length).toEqual(12);

    // check that categories are present
  });

  it("should correctly redirect when clicking on a category and filter market cards", async () => {
    await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main")
    await expect(page).toClick("a[href$='#/markets?category=crypto']")
    
    // check that url is correct
    const pageUrl = await page.evaluate(() => location.href);
    expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/markets?category=crypto`)

    // check that header is correct
    const headerWrapper = await page.$('div.markets-header-styles_MarketsHeader__wrapper');
    expect(await headerWrapper.$eval('h1', node => node.innerText)).toBe('CRYPTO');

    // check that markets listed are correct
  });

  it("should display market cards correctly", async () => {
  });
});
