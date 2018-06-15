import {Page} from "puppeteer";

export const dismissDisclaimerModal = async (page:Page) => {
  const isModalDismissed = await page.evaluate(() => window.integrationHelpers.hasDisclaimerModalBeenDismissed());
  if(isModalDismissed) return;

  // dismiss welcome to beta popup.
  return await expect(page).toClick("button", {
    text: "I have read and understand the above",
    timeout: 5000
  });
};
