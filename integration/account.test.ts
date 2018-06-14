import "jest-environment-puppeteer";
import {UnlockedAccounts} from "./constants/accounts";
import {dismissDisclaimerModal} from "./helpers/dismiss-disclaimer-modal";

const url = `${process.env.AUGUR_URL}`;

jest.setTimeout(100000);

describe("Account", () => {
  beforeAll(async () => {
    await page.goto(url);

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });
  });

  describe("Authentication", () => {
    it("should only display two options in the sidebar when not logged in", async () => {
      // options should be "Markets" and "Account"
    });
    it("should display full sidebar when logged in", async () => {
    });
  });

  describe("REP Faucet Page", () => {
    it("should have a working 'Get REP' button", async () => {
      // click 'Get REP' button 
      // verify you receieved a confirmed notification 
      // you balance should now have 47.00 more REP
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
