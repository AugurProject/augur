import "jest-environment-puppeteer";
import {UnlockedAccounts} from "./constants/accounts";
import {dismissDisclaimerModal} from "./helpers/dismiss-disclaimer-modal";
import { ElementHandle } from "puppeteer";

const url = `${process.env.AUGUR_URL}`;
const MARKETS_SELECTOR = ".market-common-styles_MarketCommon__container"
const TIMEOUT = 5000;

jest.setTimeout(100000);

const checkNumElements = async (isMarkets: boolean, num: number) => {
  const selector = (isMarkets ? MARKETS_SELECTOR : ".inner-nav-styles_InnerNav__menu-item--visible")
  const elements = await page.$$(selector)
  return await expect(elements.length).toEqual(num);
}

const checkMarketNames = async (expectedMarketTitles: string[]) => {
  for (let i = 0; i < expectedMarketTitles.length; i++) {
    await expect(page).toMatchElement("a", { text: expectedMarketTitles[i]})
  }
  return 
}

describe("Markets List", () => {
  let yesNoMarket:ElementHandle | void;
  let yesNoMarketId:string;
  const yesNoMarketDesc = "Will antibiotics be outlawed for agricultural use in China by the end of 2019?"

  beforeAll(async () => {
    await page.goto(url);

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });

    await dismissDisclaimerModal(page);

    await expect(page).toClick("a[href$='#/markets']")
    yesNoMarketId = await page.evaluate((marketDescription) => window.integrationHelpers.findMarketId(marketDescription), yesNoMarketDesc);
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

  describe("Filtering", () => {
    beforeAll(async () => {
      await page.goto(url + "#/markets?category=politics"); // click sometimes fails because of page rerenders
    });

    it("should display both submenu bars", async () => {
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main")
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--submenu")
    });

    it("should filter market cards", async () => {
      // check that header is correct
      await expect(page).toMatchElement("h1", { text: "politics"})

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
      await expect(page).toClick("a[href$='#/markets']")
      checkNumElements(true, 10)
    });
  });

  describe("Search", () => {
     
    it("should filter markets to show only ones with searched keyword", async () => {
      // enter in a search keyword
      await expect(page).toFill("input.filter-search-styles_FilterSearch__input", "jair");
      checkNumElements(true, 1)

      // check that market that shows up is correct one
      checkMarketNames(["Will Jair Messias Bolsonaro be elected the president of Brazil in 2018?"])
    });

    it("should not have case sensitive search", async () => {
      // make sure clearing search works
      await expect(page).toClick(".input-styles_close")
      await expect(page).toFill("input.filter-search-styles_FilterSearch__input", "JAIR");
      checkNumElements(true, 1)
    });

    it("should have markets be searchable by title, tag, or category", async () => {
      // search for a category
      await expect(page).toClick(".input-styles_close")
      await expect(page).toFill("input.filter-search-styles_FilterSearch__input", "crypto");
      checkNumElements(true, 2)

      // check that expected titles are present
      const expectedMarketTitles = ["Will Ethereum trade at $2000 or higher at any time before the end of 2018?", "Millions of Tether tokens issued on Thu Jun 07 2018 (round down)"]
      checkMarketNames(expectedMarketTitles)

      await expect(page).toClick(".input-styles_close")

      // search for a tag
      await expect(page).toFill("input.filter-search-styles_FilterSearch__input", "sfo");
      checkNumElements(true, 1)
    });
  });

  describe("Market Cards", () => {
    beforeAll(async () => {
      await page.goto(url + "#/markets?category=agriculture");
      yesNoMarket = await expect(page).toMatchElement("article", { text: yesNoMarketDesc})
    });

    it("should display market title", async () => {
      await expect(yesNoMarket).toMatchElement("a", { text: yesNoMarketDesc})
    });

    it("display the min and max values accurately on either ends of the scale", async () => {
      await expect(yesNoMarket).toMatchElement(".market-outcomes-yes-no-scalar-styles_MarketOutcomes__min", { text: "0 %"})
      await expect(yesNoMarket).toMatchElement(".market-outcomes-yes-no-scalar-styles_MarketOutcomes__max", { text: "100 %"})
    });

    it("should display stats about volume, settlement Fee, and Expiration Date", async () => {
      await expect(yesNoMarket).toMatchElement(".value_volume", { text: "0"})
      await expect(yesNoMarket).toMatchElement(".value_fee", { text: "2.00"})
      await expect(yesNoMarket).toMatchElement(".value_expires", { text: "Dec 31, 2019 4:00 PM (UTC -8)"})
    });

    it("should display a togglable favorites star to the left of the action button on the bottom right of the card", async () => {
      await expect(yesNoMarket).toClick("button.market-properties-styles_MarketProperties__favorite")
      await page.waitForSelector(".fa-star")
    });

    it("should display an action button that reads 'trade' which when clicked brings you to the trade view for that market", async () => {
      await expect(page).toClick("a.market-properties-styles_MarketProperties__trade")
      await page.waitForSelector(".market-header-styles_MarketHeader__back-button", {timeout: TIMEOUT}) // wait to be on right page
      const pageUrl = await page.url();
      expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/market?description=will_antibiotics_be_outlawed_for_agricultural_use_in_china_by_the_end_of_2019&id=${yesNoMarketId}`)
    });

    it("should bring you to the trade view for that market when clicking on market title", async () => {
      await expect(page).toClick("span", {text: "back", timeout: TIMEOUT})
      await expect(page).toClick("a", { text: yesNoMarketDesc, timeout: TIMEOUT })
      await page.waitForSelector(".market-header-styles_MarketHeader__back-button", {timeout: TIMEOUT}) // wait to be on right page
      const pageUrl = await page.url();
      expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/market?description=will_antibiotics_be_outlawed_for_agricultural_use_in_china_by_the_end_of_2019&id=${yesNoMarketId}`)
    });

    it("should display categorical market outcomes correctly", async () => {
      await page.goto(url + "#/markets?category=science&tags=mortality");
      const categoricalMarket = await expect(page).toMatchElement("article", { text: "What will be the number one killer in the United States by January 1, 2019?"})

      // display the top 3 outcomes for a Categorical Market, with a "+ N More" where N is the number of remaining outcomes
      await expect(categoricalMarket).toMatchElement(".market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more", { text: "+ 3 more"})
      const outcomes = await page.$$(".market-outcomes-categorical-styles_MarketOutcomesCategorical__outcome")
      expect(outcomes.length).toEqual(6)

      // click show more button
      await expect(categoricalMarket).toClick(".market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more")

      // "+ N More" should change to "- N More" when expanded, should collapse again on click.
      await expect(categoricalMarket).toMatchElement(".market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more", { text: "- 3 less"})
    });
  });
});
