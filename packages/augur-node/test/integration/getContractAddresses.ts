import { expect } from "chai";
import "mocha";
import { augur, augurNodeRequest } from "./utils";

describe("getSyncData", () => {
  let result: any;
  before( async () => {
    result = await augurNodeRequest("getSyncData", {});
  });
  it("isSyncFinished", () => {
    expect(result.isSyncFinished).to.equal(true);
  });
  it("contract addresses match", () => {
    expect(result.addresses).to.deep.equal(augur.contracts.addresses[result.netId]);
  });
});
