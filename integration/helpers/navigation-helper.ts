
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
  await page.goto(url.concat("#/reporting-report-markets"), {waitUntil: "networkidle0"});
};

export const toAccount = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/deposit-funds"), {waitUntil: "networkidle0"});
};

export const toInitialReporting = async (marketDesc: string) => {
  await toReporting()

  const card = await expect(page).toMatchElement(".market-common-styles_MarketCommon__container", { text: marketDesc })

  await expect(card).toClick("a", {
    text: "report"
  })

};
