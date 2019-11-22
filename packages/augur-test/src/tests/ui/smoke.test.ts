import puppeteer from 'puppeteer';
// import { ACCOUNTS, FlashSession, addScripts, addGanacheScripts } from "@augurproject/tools";
import path from 'path';
import fs from 'fs';

const express = require('express');
const helmet = require('helmet');
const http = require('http');

const app = express();
app.use(helmet());
const webappBuildDir = path.join(__dirname, '../../../../augur-ui/build');
app.use(express.static(webappBuildDir));
app.listen = function() { // taken from augur-ui's server.js
  const server = http.createServer(this);
  return server.listen.apply(server, arguments);
};

let page;
let browser;
let server;
// let flash;
const port = 8080;
const width = 1920;
const height = 1080;
const headless = true;

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

describe.skip('Browser testing', () => {
  beforeAll(async () => {
    server = app.listen(port);
    browser = await puppeteer.launch({
      headless,
      slowMo: 80,
      args: [`--window-size=${width},${height}`],
    });
    page = await browser.newPage();
    await page.setViewport({ width, height });

    /* Flash is disabled because it isn't usable until we use CREATE2 for ganache deploy.

    flash = new FlashSession(ACCOUNTS);
    addScripts(flash);
    addGanacheScripts(flash);
    await flash.call("ganache", { "internal": false, "port": "8545" });
    await flash.call("load-seed-file", { "use": true, "write_artifacts": true });
    await flash.call(
      "create-reasonable-categorical-market",
      { "outcomes": "music,dance,poetry,oration,drama" });
    */
  });

  afterAll(async () => {
    await browser.close();
    await server.close();
  });

  // TODO: Smoke test is skipped until we use CREATE2 for ganache deploy.
  //       The issue is that we need to build the UI after deploying to ganache
  //       but also before running the tests.
  test('Smoke Test', async () => {
    const webappIsBuilt = await fs.existsSync(webappBuildDir);
    if (!webappIsBuilt) {
      await server.close(); // Jest will hang if this call isn't in the test itself
      await expect(webappIsBuilt).toBe(true);
    }

    await page.goto(`http://localhost:${port}/#!/markets`);

    await expect(page.title()).
      resolves.
      toMatch('Markets | Augur', { timeout: 20000 });
    await expect(page.$('.paginator_v1-styles_location')).
      resolves.
      toBeDefined();
    await expect(page.waitForSelector(
      '.market-common-styles_MarketCommon__container',
      {
        visible: true,
        timeout: 20000,
      })).resolves.toBeDefined();
  });
})
