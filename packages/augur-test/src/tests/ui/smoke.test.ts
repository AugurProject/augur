import puppeteer from "puppeteer";
import { ACCOUNTS, FlashSession, addScripts, addGanacheScripts } from "@augurproject/tools";
import path from "path";

const express = require("express");
const helmet = require("helmet");
const http = require("http");

const app = express();
app.use(helmet());
app.use(express.static(path.join(__dirname, "../../../../augur-ui/build")));
app.listen = function() {
  const server = http.createServer(this);
  return server.listen.apply(server, arguments);
};

let page;
let browser;
let server;
const port = 8080;
const width = 1920;
const height = 1080;
const headless = true;

beforeAll(async () => {
  /* Setup Steps:
   * 1. Start and populate blockchain.
   * 2. Serve app, set to point to local blockchain.
   * 3. Create puppeteer browser instance
   *
   * Test Steps:
   * 1. Point browser at local app server.
   * 2. Wait a while for the browser app to sync with the local blockchain.
   * 3. Verify the app state.
   */

  server = app.listen(port);

  browser = await puppeteer.launch({
    headless,
    slowMo: 80,
    args: [`--window-size=${width},${height}`],
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });

  const flash = new FlashSession(ACCOUNTS);
  addScripts(flash);
  addGanacheScripts(flash);
  await flash.call("ganache", { "internal": false, "port": "8545" });
  await flash.call("load-seed-file", { "use": true, "write_artifacts": true });
  await flash.call("create-reasonable-categorical-market", { "outcomes": "music,dance,poetry,oration,drama"});
}, 3 * 180 * 1000);

afterAll(() => {
  browser.close();
  server.close();
});

test("Smoke Test", async () => {
  await page.goto(`http://localhost:${port}/#!/markets`);

  // TODO unnecessary? for awaiting node sync but does t hat even happen?
  await ((ms: number) => new Promise( resolve => setTimeout(resolve, ms)))(20 * 1000);

  await expect(page.title()).resolves.toMatch('Markets | Augur');
  await expect(page.$(".paginator_v1-styles_location")).toBeDefined();
  await expect(page.waitForSelector(".market-common-styles_MarketCommon__container", { visible: true })).toBeDefined()


}, 60 * 1000);
