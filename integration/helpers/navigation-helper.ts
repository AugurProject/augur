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
  await page.goto(url.concat("#/my-positions"), { waitUntil: "networkidle0" });
};

export const toMyMarkets = async () => {
  const url = `${process.env.AUGUR_URL}`;
  await page.goto(url.concat("#/my-markets"), { waitUntil: "networkidle0" });
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
