import "jest-environment-puppeteer";
import {UnlockedAccounts} from "./constants/accounts";

const url = `${process.env.AUGUR_URL}`;

jest.setTimeout(100000);

const checkNumElements = async (isMarkets, num) => {
  try {
    const selector = (isMarkets ? ".market-common-styles_MarketCommon__container" : ".inner-nav-styles_InnerNav__menu-item--visible")
    const markets = await page.$$(selector)
    return expect(markets.length).toEqual(num);
  } catch (error) {
    return error
  }
}

const checkMarketNames = async (expectedMarketTitles) => {
  try {
    const markets = await page.$$(".market-common-styles_MarketCommon__container")
    for (let i = 0; i < markets.length; i++) {
      expect(await markets[i].$eval('a', node => node.innerText)).toBe(expectedMarketTitles[i]);
    });
    return
  } catch (error) {
    return error
  }
}

describe("Markets List", () => {
  let markets;
  let yesNoMarket;
  let yesNoMarketId;
  const yesNoMarketDesc = 'Will antibiotics be outlawed for agricultural use in China by the end of 2019?'

  beforeAll(async () => {
    await page.goto(url);

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });

    yesNoMarketId = await page.evaluate((marketDescription) => window.integrationHelpers.findMarketId(marketDescription), yesNoMarketDesc);

    await page.waitForSelector("div.modal-disclaimer-styles_ModalDisclaimer__ActionButtons")
    await expect(page).toClick("button", {
      text: "I have read and understand the above"
    });
    await page.waitForSelector("aside.side-nav-styles_SideNav")
    await expect(page).toClick("a[href$='#/markets")
  });

  describe("General View", () => {

    it("should paginate in chunks of 10", async () => {
      await page.waitForSelector(".markets-list")
      checkNumElements(true, 10)
    });

    it("should display all categories for every loaded market in the sidebar", async () => {
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main")
      checkNumElements(false, 12)
    });
  });

    describe("Market Cards", () => {
      beforeAll(async () => {
        await expect(page).toClick("a[href$='#/markets?category=agriculture']")
        markets = await page.$$(".market-common-styles_MarketCommon__container")
        yesNoMarket = markets[0] // this has to be the "Will antibiotics" market
      });

      it("should display market title", async () => {
        expect(await yesNoMarket.$eval('a', node => node.innerText)).toBe(yesNoMarketDesc);
      });

      it("display the min and max values accurately on either ends of the scale", async () => {
        expect(await yesNoMarket.$eval('.market-outcomes-yes-no-scalar-styles_MarketOutcomes__min', node => node.innerText)).toBe('0 %');
        expect(await yesNoMarket.$eval('.market-outcomes-yes-no-scalar-styles_MarketOutcomes__max', node => node.innerText)).toBe('100 %');
      });

      it("should display stats about volume, settlement Fee, and Expiration Date", async () => {
        expect(await yesNoMarket.$eval('.value_volume', node => node.innerText)).toBe('0');
        expect(await yesNoMarket.$eval('.value_fee', node => node.innerText)).toBe('2.00');
        expect(await yesNoMarket.$eval('.value_expires', node => node.innerText)).toBe('DEC 31, 2019 4:00 PM (UTC -8)');
      });

      it("should display a togglable favorites star to the left of the action button on the bottom right of the card", async () => {
        await expect(yesNoMarket).toClick("button.market-properties-styles_MarketProperties__favorite")
        await page.waitForSelector(".fa-star")
      });

      it("should display an action button that reads 'trade' which when clicked brings you to the trade view for that market", async () => {
        await expect(page).toClick("a.market-properties-styles_MarketProperties__trade")
        const pageUrl = await page.evaluate(() => location.href);
        expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/market?description=will_antibiotics_be_outlawed_for_agricultural_use_in_china_by_the_end_of_2019&id=${yesNoMarketId}`)
      });

      it("should bring you to the trade view for that market when clicking on market title", async () => {
        await page.goto(url + '#/markets?category=agriculture');
        await expect(page).toClick("a.market-link")
        const pageUrl = await page.evaluate(() => location.href);
        expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/market?description=will_antibiotics_be_outlawed_for_agricultural_use_in_china_by_the_end_of_2019&id=${yesNoMarketId}`)
      });

      it("should display categorical market outcomes correctly", async () => {
        await page.goto(url + '#/markets?category=science&tags=mortality');
        markets = await page.$$(".market-common-styles_MarketCommon__container")
        const categoricalMarket = markets[0]

        // display the top 3 outcomes for a Categorical Market, with a "+ N More" where N is the number of remaining outcomes
        expect(await categoricalMarket.$eval('.market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more', node => node.innerText)).toBe('+ 3 MORE');
        const outcomes = await page.$$(".market-outcomes-categorical-styles_MarketOutcomesCategorical__outcome")
        expect(outcomes.length).toEqual(6)

        // click show more button
        await expect(categoricalMarket).toClick(".market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more")

        // "+ N More" should change to "- N More" when expanded, should collapse again on click.
        expect(await categoricalMarket.$eval('.market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more', node => node.innerText)).toBe('- 3 LESS');
      });
    });
  });

  describe("Filtering", () => {
    beforeAll(async () => {
      await page.goto(url + '#/markets?category=politics');
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main")
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--submenu")
    });

    it("should correctly redirect after category click", async () => {

      // check that url is correct
      const pageUrl = await page.evaluate(() => location.href);
      expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/markets?category=politics`)
    });

    it("should filter market cards", async () => {

      // check that header is correct
      const headerWrapper = await page.$('div.markets-header-styles_MarketsHeader__wrapper');
      expect(await headerWrapper.$eval('h1', node => node.innerText)).toBe('POLITICS');

      // check that number of markets listed is as expected
      checkNumElements(true, 3)
    });
    
    it("should populate submenu bar with the tag values for the markets displayed", async () => {
      // check that tag submenu has right number of tags displayed
      checkNumElements(false, 17)
    });

    it("should filter out markets that don't match the selected tags when clicking on tags", async () => {
      // when clicking on elections check that only two markets are displayed
      await expect(page).toClick("button.elections")
      checkNumElements(true, 2)
    });

    it("should show all markets after clicking the market button", async () => {
      await expect(page).toClick("a[href$='#/markets")
      checkNumElements(true, 10)
    });
  });

  describe("Search", () => {
     
     beforeAll(async () => {
      await page.goto(url + '#/markets');
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main")
    });

    it("should filter markets to show only ones with searched keyword", async () => {
      // enter in a search keyword
      await expect(page).toFill("input.filter-search-styles_FilterSearch__input", "jair");
      checkNumElements(true, 1)

      // check that market that shows up is correct one
      checkMarketNames(['Will Jair Messias Bolsonaro be elected the president of Brazil in 2018?'])
    });

    it("should clear search and show all markets after clearing the search", async () => {
      await expect(page).toClick(".input-styles_close")
      checkNumElements(true, 10)
    });

    it("should not have case sensitive search", async () => {
      await expect(page).toFill("input.filter-search-styles_FilterSearch__input", "JAIR");
      checkNumElements(true, 1)
    });

    it("should have markets be searchable by title, tag, or category", async () => {
      // search for a category
      await expect(page).toFill("input.filter-search-styles_FilterSearch__input", "crypto");
      checkNumElements(true, 2)

      // check that expected titles are present
      const expectedMarketTitles = ['Will Ethereum trade at $2000 or higher at any time before the end of 2018?', 'Millions of Tether tokens issued on Thu Jun 07 2018 (round down)']
      checkMarketNames(expectedMarketTitles)

      await expect(page).toClick(".input-styles_close")

      // search for a tag
      await expect(page).toFill("input.filter-search-styles_FilterSearch__input", "sfo");
      checkNumElements(true, 1)
    });
  });
});
