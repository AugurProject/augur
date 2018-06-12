import { expect } from "chai";
import "mocha";
import { augurNodeRequest } from "./utils";
import Augur from "augur.js";


describe("getContractAddresses", () => {
  let result: any;
  before( async () => {
    result = await augurNodeRequest("getContractAddresses", {});
  });
  it("isSyncFinished", () => {
    expect(result.isSyncFinished).to.equal(true);
  });
  it("contract addresses match", () => {
    const augur = new Augur();
    expect(result.addresses).to.deep.equal(augur.contracts.addresses[result.netId]);
  });
});


