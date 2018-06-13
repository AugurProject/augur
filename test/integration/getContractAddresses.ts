import { expect } from "chai";
import "mocha";
import { augur, augurNodeRequest } from "./utils";

describe("getContractAddresses", () => {
  let result: any;
  before( async () => {
    result = await augurNodeRequest("getContractAddresses", {});
  });
  it("isSyncFinished", () => {
    expect(result.isSyncFinished).to.equal(true);
  });
  it("contract addresses match", () => {
    expect(result.addresses).to.deep.equal(augur.contracts.addresses[result.netId]);
  });
});
