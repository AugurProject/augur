import * as views from "modules/routes/constants/views";

describe("modules/app/constants/views", () => {
  test("Returned the expected value 'M'", () => {
    expect(views.MARKET).toStrictEqual("market");
  });

  test("Returned the expected value 'MARKETS'", () => {
    expect(views.MARKETS).toStrictEqual("markets");
  });

  test("Returned the expected value 'CREATE_MARKET'", () => {
    expect(views.CREATE_MARKET).toStrictEqual("create-market");
  });

  test("Returned the expected value 'TRANSACTIONS'", () => {
    expect(views.TRANSACTIONS).toStrictEqual("transactions");
  });

  test("Returned return the expected value 'ACCOUNT'", () => {
    expect(views.ACCOUNT).toStrictEqual("account");
  });

  test("Returned the expected value 'MY_POSITIONS'", () => {
    expect(views.MY_POSITIONS).toStrictEqual("my-positions");
  });

  test("Returned the expected value 'MY_MARKETS'", () => {
    expect(views.MY_MARKETS).toStrictEqual("my-markets");
  });

  test("Returned the expected value 'REPORTING'", () => {
    expect(views.REPORTING).toStrictEqual("reporting");
  });

  test("Returned the expected value 'MARKET_DATA_NAV_OUTCOMES'", () => {
    expect(views.MARKET_DATA_NAV_OUTCOMES).toStrictEqual("outcomes");
  });

  test("Returned the expected value 'MARKET_DATA_ORDERS'", () => {
    expect(views.MARKET_DATA_ORDERS).toStrictEqual("orders");
  });

  test("Returned the expected value 'MARKET_DATA_NAV_CHARTS'", () => {
    expect(views.MARKET_DATA_NAV_CHARTS).toStrictEqual("charts");
  });

  test("Returned the expected value 'MARKET_DATA_NAV_DETAILS'", () => {
    expect(views.MARKET_DATA_NAV_DETAILS).toStrictEqual("details");
  });

  test("Returned the expected value 'MARKET_DATA_NAV_REPORT'", () => {
    expect(views.MARKET_DATA_NAV_REPORT).toStrictEqual("report");
  });

  test("Returned the expected value 'MARKET_DATA_NAV_SNITCH'", () => {
    expect(views.MARKET_DATA_NAV_SNITCH).toStrictEqual("snitch");
  });

  test("Returned the expected value 'MARKET_USER_DATA_NAV_POSITIONS'", () => {
    expect(views.MARKET_USER_DATA_NAV_POSITIONS).toStrictEqual("positions");
  });

  test("Returned the expected value 'MARKET_USER_DATA_NAV_OPEN_ORDERS'", () => {
    expect(views.MARKET_USER_DATA_NAV_OPEN_ORDERS).toStrictEqual("open-orders");
  });

  test("Returned the expected value 'ACCOUNT_DEPOSIT'", () => {
    expect(views.ACCOUNT_DEPOSIT).toStrictEqual("deposit-funds");
  });

  test("Returned the expected value 'ACCOUNT_TRANSFER'", () => {
    expect(views.ACCOUNT_TRANSFER).toStrictEqual("transfer-funds");
  });
});
