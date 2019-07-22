import puppeteer from "puppeteer";

let page;
let browser;
const width = 1920;
const height = 1080;
const headless = true;

describe('Google', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless,
      slowMo: 80,
      args: [`--window-size=${width},${height}`],
    });
    page = await browser.newPage();
    await page.setViewport({ width, height });
  });

  afterAll(() => {
    browser.close();
  });

  it('should be titled "Google"', async () => {
    await page.goto('https://google.com');
    await expect(page.title()).resolves.toMatch('Google');
  });
});
