export const toDefaultView = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url);
};

export const toMarketListView = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/markets"), { waitUntil: "networkidle0" });
};

export const toMarketCreate = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/create-market"), { waitUntil: "networkidle0" });
};

export const toPortfolio = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/my-positions"));
};

export const toMyMarkets = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/my-markets"));
};

export const toReporting = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/reporting-report-markets"));
};

export const toAccount = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/deposit-funds"), { waitUntil: "networkidle0" });
};

export const toMarket = async (id: string) => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("/#/market?id=" + id));
};

export const toInitialReporting = async (id: string) => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/report?id=" + id));
};

export const toDisputing = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/reporting-dispute-markets"));
};

export const clickToMarkets = async(timeoutMilliseconds: number = 500) => {
  await expect(page).toClick("span", { text: "Markets", timeout: timeoutMilliseconds });
}
 export const searchForMarketByDescription = async(marketDescription: string, timeoutMilliseconds: number = 500) => {
  await expect(page).toFill(".filter-search-styles_FilterSearch__input", marketDescription, { timeout: timeoutMilliseconds });
  await expect(page).toClick(".market-common-styles_MarketCommon__topcontent h1 span .market-link", { text: marketDescription, timeout: timeoutMilliseconds });
  await expect(page).toClick(".core-properties-styles_CoreProperties__property-button", { text: "REPORT", timeout: timeoutMilliseconds });
}
