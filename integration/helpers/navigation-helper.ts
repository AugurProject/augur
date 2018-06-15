import { dismissDisclaimerModal } from "../helpers/dismiss-disclaimer-modal";

export const toDefaultView = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url);
  await dismissDisclaimerModal(page);
};

export const toMarketListView = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/markets"), {waitUntil: "networkidle0"});
};

export const toMarketCreate = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/create-market"), {waitUntil: "networkidle0"});
};

export const toPortfolio = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/my-positions"), {waitUntil: "networkidle0"});
};

export const toReporting = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/reporting-report-markets"));
};

export const toAccount = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/deposit-funds"), {waitUntil: "networkidle0"});
};

export const toInitialReporting = async (marketDesc: string) => {
  const card = await expect(page).toMatchElement(".market-common-styles_MarketCommon__container", { text: marketDesc, timeout: 8000 })
  await expect(card).toClick("a", {
    text: "report",
    timeout: 1000,
  })
};
