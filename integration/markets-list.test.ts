import "jest-environment-puppeteer";
import Flash from "./helpers/flash";
import { ElementHandle } from "puppeteer";
import { createYesNoMarket } from "./helpers/create-markets";
import { IFlash, IMarket } from "./types/types";
import { waitNextBlock } from "./helpers/wait-new-block";
require("./helpers/beforeAll");

// TODO: Replace uses of `url` with calls to functions in navigation-helper
const url = `${process.env.AUGUR_URL}`;
const CATEGORY_SELECTOR = ".inner-nav-styles_InnerNav__menu-item--visible";
const MARKET_SELECTOR = ".market-common-styles_MarketCommon__container";

const TIMEOUT = 8000;

jest.setTimeout(100000);

let flash: IFlash = new Flash();

const checkNumElements = async (isMarkets: boolean, num: number) => {
  const selector = isMarkets ? MARKET_SELECTOR : CATEGORY_SELECTOR;
  let elements = await page.$$(selector);
  while (elements.length != num) {
    elements = await page.$$(selector);
  }
  return true;
};

const checkMarketNames = async (expectedMarketTitles: string[]) => {
  for (let i = 0; i < expectedMarketTitles.length; i++) {
    await expect(page).toMatchElement("a", { text: expectedMarketTitles[i] });
  }
  return;
};

describe("Markets List", () => {
  let yesNoMarket: ElementHandle | void;
  let yesNoMarketId: string;
  const yesNoMarketDesc =
    "Will antibiotics be outlawed for agricultural use in China by the end of 2019?";

  beforeAll(async () => {
    await expect(page).toClick("a[href$='#/markets']");
    yesNoMarketId = await page.evaluate(
      marketDescription =>
        window.integrationHelpers.findMarketId(marketDescription),
      yesNoMarketDesc
    );
  });

  afterAll(async () => {
    flash.dispose();
  });

  describe("General View", () => {
    it("should paginate in chunks of 10", async () => {
      await page.waitForSelector(
        ".market-common-styles_MarketCommon__container"
      );
      await checkNumElements(true, 10);
    });

    it("should display all categories for every loaded market in the sidebar", async () => {
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main");
      await checkNumElements(false, 12);

      // TODO: check which categories are present
    });
  });

  describe("Filtering", () => {
    beforeEach(async () => {
      await page.goto(url + "#/markets?category=politics"); // click sometimes fails because of page rerenders
    });

    it("should display both submenu bars", async () => {
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--main");
      await page.waitForSelector(".inner-nav-styles_InnerNav__menu--submenu");
    });

    it("should filter market cards", async () => {
      // check that header is correct
      await expect(page).toMatchElement("h1", { text: "politics" });

      // check that number of markets listed is as expected
      await checkNumElements(true, 3);
    });

    it("should populate submenu bar with the tag values for the markets displayed", async () => {
      // check that tag submenu has right number of tags displayed
      await checkNumElements(false, 17);
    });

    it("should filter out markets that don't match the selected tags when clicking on tags", async () => {
      // when clicking on elections check that only two markets are displayed
      await page.goto(url + "#/markets?category=politics&tags=elections"); // click sometimes fails because of page rerenders
      await checkNumElements(true, 2);
    });

    it("should show all markets after clicking the market button", async () => {
      await expect(page).toClick("a[href$='#/markets']");
      await checkNumElements(true, 10);
    });
  });

  describe("Search", () => {
    it("should filter markets to show only ones with searched keyword", async () => {
      // enter in a search keyword
      await expect(page).toFill(
        "input.filter-search-styles_FilterSearch__input",
        "jair"
      );
      await checkNumElements(true, 1);

      // check that market that shows up is correct one
      await checkMarketNames([
        "Will Jair Messias Bolsonaro be elected the president of Brazil in 2018?"
      ]);
    });

    it("should not have case sensitive search", async () => {
      // make sure clearing search works
      await expect(page).toClick(".input-styles_close", { timeout: TIMEOUT });
      await expect(page).toFill(
        "input.filter-search-styles_FilterSearch__input",
        "JAIR"
      );
      await checkNumElements(true, 1);
    });

    it("should have markets be searchable by title, tag, or category", async () => {
      // search for a category
      await expect(page).toClick(".input-styles_close", { timeout: TIMEOUT });
      await expect(page).toFill(
        "input.filter-search-styles_FilterSearch__input",
        "crypto"
      );
      await checkNumElements(true, 2);

      // check that expected titles are present
      const expectedMarketTitles = [
        "Will Ethereum trade at $2000 or higher at any time before the end of 2018?",
        "Millions of Tether tokens issued on "
      ];
      await checkMarketNames(expectedMarketTitles);

      await expect(page).toClick(".input-styles_close");

      // search for a tag
      await expect(page).toFill(
        "input.filter-search-styles_FilterSearch__input",
        "sfo"
      );
      await checkNumElements(true, 1);
    });
  });

  describe("Market Cards", () => {
    let newMarket: IMarket;

    beforeAll(async () => {
      await page.goto(url + "#/markets?category=agriculture");
      yesNoMarket = await expect(page).toMatchElement("article", {
        text: yesNoMarketDesc
      });
      newMarket = await createYesNoMarket();
      await waitNextBlock(10);
    });

    it("should display market title", async () => {
      await expect(yesNoMarket).toMatchElement("a", { text: yesNoMarketDesc });
    });

    it("should display category and tags in the top left corner of each card", async () => {
      await expect(yesNoMarket).toMatchElement("[data-testid='Category-0'", {
        text: "AGRICULTURE",
        timeout: TIMEOUT
      });
      await expect(yesNoMarket).toMatchElement("[data-testid='Tags-0'", {
        text: "antibiotics"
      });
      await expect(yesNoMarket).toMatchElement("[data-testid='Tags-1'", {
        text: "China"
      });
    });

    it("display the min and max values accurately on either ends of the scale", async () => {
      // (0% - 100% for binary markets, min - max for scalar markets)
      await expect(yesNoMarket).toMatchElement(
        ".market-outcomes-yes-no-scalar-styles_MarketOutcomes__min",
        { text: "0 %" }
      );
      await expect(yesNoMarket).toMatchElement(
        ".market-outcomes-yes-no-scalar-styles_MarketOutcomes__max",
        { text: "100 %" }
      );
    });

    it("should display stats about volume, settlement Fee, and Expiration Date", async () => {
      await expect(yesNoMarket).toMatchElement(".value_volume", { text: "0" });
      await expect(yesNoMarket).toMatchElement(".value_fee", { text: "2.00" });
      // @todo Figure out how to handle local datetimes
      // await expect(yesNoMarket).toMatchElement(".value_expires", { text: "Dec 31, 2019 4:00 PM (UTC -8)"})
    });

    it("should display a togglable favorites star to the left of the action button on the bottom right of the card", async () => {
      await expect(yesNoMarket).toClick(
        "button.market-properties-styles_MarketProperties__favorite"
      );
      await page.waitForSelector(".buttons-styles_FavoriteButton_Favorite");
    });

    it("should display an action button that reads 'trade' which when clicked brings you to the trade view for that market", async () => {
      await expect(page).toClick(
        "a.market-properties-styles_MarketProperties__trade"
      );
      await page.waitForSelector(
        ".market-header-styles_MarketHeader__back-button",
        { timeout: TIMEOUT }
      ); // wait to be on right page
      const pageUrl = await page.url();
      expect(pageUrl).toEqual(
        `${process.env.AUGUR_URL}#/market?id=${yesNoMarketId}`
      );
    });

    it("should bring you to the trade view for that market when clicking on market title", async () => {
      await expect(page).toClick("span", { text: "back", timeout: TIMEOUT });
      await expect(page).toClick("a", {
        text: yesNoMarketDesc,
        timeout: TIMEOUT
      });
      await page.waitForSelector(
        ".market-header-styles_MarketHeader__back-button",
        { timeout: TIMEOUT }
      ); // wait to be on right page
      const pageUrl = await page.url();
      expect(pageUrl).toEqual(
        `${process.env.AUGUR_URL}#/market?id=${yesNoMarketId}`
      );
    });

    it("should display categorical market outcomes correctly", async () => {
      await page.goto(url + "#/markets?category=science&tags=mortality");
      const categoricalMarket = await expect(page).toMatchElement("article", {
        text:
          "What will be the number one killer in the United States by January 1, 2019?",
        timeout: TIMEOUT
      });

      // display the top 3 outcomes for a Categorical Market, with a "+ N More" where N is the number of remaining outcomes
      await expect(categoricalMarket).toMatchElement(
        ".market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more",
        { text: "+ 3 more", timeout: TIMEOUT }
      );
      const outcomes = await page.$$(
        ".market-outcomes-categorical-styles_MarketOutcomesCategorical__outcome"
      );
      expect(outcomes.length).toEqual(6);

      // click show more button
      await expect(categoricalMarket).toClick(
        ".market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more"
      );

      // "+ N More" should change to "- N More" when expanded, should collapse again on click.
      await expect(categoricalMarket).toMatchElement(
        ".market-outcomes-categorical-styles_MarketOutcomesCategorical__show-more",
        { text: "- 3 less", timeout: TIMEOUT }
      );
    });

    it("should display a scale with the current mid-price for the market", async () => {
      // go to new markets page
      await page.goto(url + "#/markets?category=space");
      await page.waitForSelector(
        "[data-testid='markets-" + newMarket.id + "']",
        { timeout: TIMEOUT }
      );
      await expect(page).toMatchElement(
        "[data-testid='markets-" + newMarket.id + "'] [data-testid='midpoint']",
        {
          text: "50.00",
          timeout: TIMEOUT
        }
      );
    });

    it("should have accurate volume stat", async () => {
      // expect volume to start at zero
      await page.waitForSelector(
        "[data-testid='markets-" + newMarket.id + "']",
        { timeout: TIMEOUT }
      );
      await expect(page).toMatchElement(
        "[data-testid='markets-" + newMarket.id + "'] .value_volume",
        {
          text: "0",
          timeout: TIMEOUT
        }
      );

      // create and fill order
      await flash.createMarketOrder(newMarket.id, "1", "sell", ".1", "2");
      await waitNextBlock(10);
      await flash.fillMarketOrders(newMarket.id, "1", "buy");
      await waitNextBlock(10);

      // expect volume increase
      await page.waitForSelector(
        "[data-testid='markets-" + newMarket.id + "']",
        { timeout: TIMEOUT }
      );
      await expect(page).toMatchElement(
        "[data-testid='markets-" + newMarket.id + "'] .value_volume",
        {
          text: "2.0000",
          timeout: TIMEOUT
        }
      );
    });

    it("should verify that the midprice moves along the scale appropriately", async () => {
      await page.waitForSelector(
        "[data-testid='markets-" + newMarket.id + "']",
        { timeout: TIMEOUT }
      );
      await expect(page).toMatchElement(
        "[data-testid='markets-" + newMarket.id + "'] [data-testid='midpoint']",
        {
          text: "10.00",
          timeout: TIMEOUT
        }
      );
    });
  });
});
