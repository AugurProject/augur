import "jest-environment-puppeteer";
import {UnlockedAccounts} from "./constants/accounts";
import {dismissDisclaimerModal} from "./helpers/dismiss-disclaimer-modal";

const url = `${process.env.AUGUR_URL}`;

jest.setTimeout(100000);
//await page.waitForSelector('.fdfjdf', {timeout: 1200000})
describe("Account", () => {
  beforeAll(async () => {
    await page.goto(url);

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });
    await dismissDisclaimerModal(page);
  });

  describe("Authentication", () => {
    it("should only display two options in the sidebar when not logged in", async () => {
      // logout
      await page.evaluate(() => window.integrationHelpers.logout());

      // options available should be "Markets" and "Account"
      await page.waitForSelector("a[href$='#/markets']")
      await page.waitForSelector("a[href='#/deposit-funds']")

      // check that only those two options show up
      const sidebarElements = await page.$$("li")
      await expect(sidebarElements.length).toEqual(2);

    });
    
    it("should correctly display 'Account' page", async () => {
      // click on account page
      await expect(page).toClick("span", {
        text: "Account"
      });

      // expect to be on authentication page 
      const pageUrl = await page.evaluate(() => location.href);
      expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/authentication`)
    });

    it("should display full sidebar when logged in", async () => {
      // log in
      await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.CONTRACT_OWNER);

      // check that all sidebar options show up
      const sidebarElements = await page.$$("li")
      await expect(sidebarElements.length).toEqual(5);
    });
  });

  describe("REP Faucet Page", () => {
    it("should have a working 'Get REP' button", async () => {
      // navigate to rep faucet
      await page.goto(url + '#/rep-faucet');

      // get account data
      const accountData = await page.evaluate(() => window.integrationHelpers.getAccountData());
      const initialREP = accountData.rep;

      // click 'Get REP' button 
      await expect(page).toClick("button.account-rep-faucet-styles_AccountRepFaucet__button")

      // verify you receieved a confirmed notification 
      await expect(page).toClick("button.top-bar-styles_TopBar__notification-icon")
      await expect(page).toMatch("faucet - confirmed", {timeout: 50000})

      // your balance should now have 47.00 more REP
      const accountData = await page.evaluate(() => window.integrationHelpers.getAccountData());
      const newREP = accountData.rep;
      expect(newREP - initialREP).toEqual(47)
    });
  });

  describe("Withdraw Page", () => {
    it("should be able to send funds to another account using the form", async () => {
      // should be able to send ETH and REP to another account
      // verify the second account received the ETH and REP
    });
  });

  describe("Deposit Page", () => {
    it("should show correct account funds", async () => {
      // correct account ETH and REP should be shown in account page and in core stats bar
    });

    it("should show correct account address", async () => {
      // correct account ETH and REP should be shown in account page and in core stats bar
    });
  });
});
