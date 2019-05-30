import { makeConnectorMock } from "../../libs";
import { Markets } from "@augurproject/sdk/build/state/api/Markets";

const connector = makeConnectorMock([]);

describe("mock-connector", () => {
  it("should return an empty array", async () => {
    const getMarkets = connector.bindTo(Markets.getMarkets);
    expect(await getMarkets({
      universe: "0x6a424C1bd008C82191Db24bA1528e60ca92314cA",
    })).toEqual(expect.arrayContaining([]));
  });
});
