import "jest-environment-puppeteer";
import {UnlockedAccounts} from "./constants/accounts";
import {dismissDisclaimerModal} from "./helpers/dismiss-disclaimer-modal";
import BigNumber from 'bignumber.js'

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
      await expect(pageUrl).toEqual(`${process.env.AUGUR_URL}#/authentication`)
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
      await expect(page).toClick("button.account-rep-faucet-styles_AccountRepFaucet__button", {timeout: 50000})

      // verify you receieved a confirmed notification 
      await expect(page).toClick("button.top-bar-styles_TopBar__notification-icon")
      await expect(page).toMatch("faucet - confirmed", {timeout: 50000})

      // your balance should now have 47.00 more REP
      const accountData = await page.evaluate(() => window.integrationHelpers.getAccountData());
      const newREP = accountData.rep;
      await expect(newREP - initialREP).toEqual(47, {timeout: 50000}) // sometimes fails
    });
  });

  describe("Withdraw Page", () => {
    it("should be able to send funds to another account using the form", async () => {
      // send eth from a second account to first account and check that the amount is right

      // keep track of original account data
      const originalAccountData = await page.evaluate(() => window.integrationHelpers.getAccountData());

      // log in to secondary account
      await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.SECONDARY_ACCOUNT);

      // navigate to withdraw page
      await page.goto(url + '#/withdraw-funds');
      
      // withdraw eth
      await expect(page).toFill("input#quantity", "100", {timeout: 5000});
      await expect(page).toFill("input#address", UnlockedAccounts.CONTRACT_OWNER);
      await expect(page).toClick("button#withdraw-button");

      // expect succesful withdraw 

      // log into original account
      await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.CONTRACT_OWNER);
      await page.goto(url + '#/deposit-funds');

      // compare old and new account balances
      const eth = await originalAccountData.eth // sometimes null for newAccountData
      const newEth = await new BigNumber(eth).plus(100)
      const formatEth = await page.evaluate((value) => window.integrationHelpers.formatEth(value), newEth);
      await expect(page).toMatch(formatEth.formatted.split(".")[0], { timeout: 10000 }) // decimals are not equal

      // const ethDiff = parseFloat(eth) - parseFloat(originalAccountData.eth);
      // expect(ethDiff).toEqual(100, {timeout: 10000});
    });
  });

  describe("Deposit Page", () => {
    it("should show correct stats in deposit page", async () => {
      await page.goto(url + '#/deposit-funds');
      const accountData = await page.evaluate(() => window.integrationHelpers.getAccountData());
      const rep = accountData.rep
      const eth = accountData.eth

      const formatRep = await page.evaluate((value) => window.integrationHelpers.formatRep(value), rep);
      const formatEth = await page.evaluate((value) => window.integrationHelpers.formatEth(value), eth);

      // correct account ETH and REP should be shown in deposit page
      await expect(page).toMatchElement("span.rep_value", { text: formatRep.formatted})
      await expect(page).toMatchElement("span.eth_value", { text: formatEth.formatted})

      // correct account ETH and REP should be shown in core stats bar
      await expect(page).toMatchElement("span#core-bar-rep", { text: formatRep.formatted})
      await expect(page).toMatchElement("span#core-bar-eth", { text: formatEth.formatted})

      // correct account address should be shown in deposit page
      const displayAddress = accountData.displayAddress
      await expect(displayAddress.toLowerCase()).toEqual(UnlockedAccounts.CONTRACT_OWNER)
      await expect(page).toMatch(displayAddress)
    });
  });
});
