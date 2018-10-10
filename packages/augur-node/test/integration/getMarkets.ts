import { expect } from "chai";
import "mocha";
import { augurNodeRequest, getContractAddresses } from "./utils";

describe("getMarkets and getMarketsInfo", () => {
  let marketIds: Array<{}>;
  let marketDetails: Array<{}>;
  before( async () => {
    const universe = (await getContractAddresses()).Universe;
    marketIds = await augurNodeRequest("getMarkets", {universe });
    marketDetails = await augurNodeRequest("getMarketsInfo", {marketIds });
  });
  it("20 markets ids", () => {
    expect(marketIds.length).to.equal(20);
  });
  it("20 markets details", () => {
    expect(marketDetails.length).to.equal(20);
  });
});
