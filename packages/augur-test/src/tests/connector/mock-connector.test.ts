import { Getters } from '@augurproject/sdk';
import { makeConnectorMock } from '../../libs';

const connector = makeConnectorMock([]);

describe("mock-connector", () => {
  it("should return an empty array", async () => {
    const getMarkets = connector.bindTo(Getters.Markets.Markets.getMarkets);
    const marketList = await getMarkets({
      universe: "0x6a424C1bd008C82191Db24bA1528e60ca92314cA",
    });
    expect(marketList.markets).toEqual(expect.arrayContaining([]));
  });
});
