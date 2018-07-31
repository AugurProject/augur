import {Page} from "puppeteer";

export const dismissDisclaimerModal = async (page: Page) => {
  const isModalDismissed = await page.evaluate(() => window.integrationHelpers.hasDisclaimerModalBeenDismissed());
  if (isModalDismissed) return;

  const timeoutMilliseconds = 10000;
  await expect(page).toClick(".modal-disclaimer-styles_ModalDisclaimer__TextBox", { timeout: timeoutMilliseconds });

  let checkboxDisabled = await page.$eval("#i_have_read_disclaimer", el => el.disabled);
  while (checkboxDisabled) {
    await page.keyboard.press('ArrowDown');
    checkboxDisabled = await page.$eval("#i_have_read_disclaimer", el => el.disabled);
  }

  await expect(page).toClick("#i_have_read_disclaimer");

  // dismiss welcome to beta popup.
  return await expect(page).toClick("button", {
    text: "I Agree and Accept the above",
    timeout: 5000
  });
};
