"use strict";

const fs = require("fs");
const { expect } = require("chai");

const { inputsExpectedAsAddress, addressFormatReviver } = require("../../build/server/address-format-reviver");

describe("server/address-format-reviver", () => {
  describe("addressFormatReviver unit tests", () => {
    it("value not in whitelist passes through unaltered", () => {
      expect(addressFormatReviver("not-in-whitelist", "0x0")).to.eq("0x0");
    });

    it("value in whitelist is formatted as valid eth address", () => {
      expect(addressFormatReviver("marketId", "0x0")).to.eq("0x0000000000000000000000000000000000000000");
    });

    it("null as passthrough", () => {
      expect(addressFormatReviver("marketId", null)).to.eq(null);
      expect(addressFormatReviver("not-in-whitelist", null)).to.eq(null);
    });

    it("undefined as passthrough", () => {
      expect(addressFormatReviver("marketId", undefined)).to.eq(undefined);
      expect(addressFormatReviver("not-in-whitelist", undefined)).to.eq(undefined);
    });
    it("Mixed case", () => {
      expect(addressFormatReviver("marketId", "0xB0b0b0B")).to.eq("0x000000000000000000000000000000000b0b0b0b");
      expect(addressFormatReviver("marketIds", ["0xB0b0b0B"])).to.deep.eq(["0x000000000000000000000000000000000b0b0b0b"]);
    });
    it("Mixed data types", () => {
      expect(addressFormatReviver("marketIds", [4, "0xB0b0b0B", null, {bad: "thing"}])).to.deep.eq([undefined, "0x000000000000000000000000000000000b0b0b0b", undefined, undefined]);
    });
    it("Extra whitespace", () => {
      expect(addressFormatReviver("marketId", "   0x0000000000000000000000000000000000000001 ")).to.eq("0x0000000000000000000000000000000000000001");
    });
  });

  describe("integration of addressFormatReviver as JSON.parse reviver", () => {
    it("parse empty object", () => {
      expect(JSON.parse("{}", addressFormatReviver)).to.deep.eq({});
    });

    it("parse and format mock getCategories request (single Address)", () => {
      const mockRpcRequest = {
        id: "5",
        jsonrpc: "2.0",
        method: "getCategories",
        params: { universe: "0x0" },
      };

      const input = JSON.stringify(mockRpcRequest);
      const expectedOutput = Object.assign({}, mockRpcRequest, { params: { universe: "0x0000000000000000000000000000000000000000" }});

      expect(JSON.parse(input, addressFormatReviver)).to.deep.eq(expectedOutput);
    });

    it("parse and format mock getUnclaimedMarketCreatorFees (Array<Address>)", () => {
      const mockRpcRequest = {
        "id": "4",
        "jsonrpc": "2.0",
        "method": "getUnclaimedMarketCreatorFees",
        "params": {
          "marketIds": ["0x0000000000000000000000000000000000000000", "0x1"],
        },
      };

      const input = JSON.stringify(mockRpcRequest);
      const expectedOutput = Object.assign({}, mockRpcRequest, { params: { marketIds: ["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000001"] }});

      expect(JSON.parse(input, addressFormatReviver)).to.deep.eq(expectedOutput);
    });
  });

  describe("verify completeness of inputs expected to be address", () => {
    const addressDefinitions = {};
    const nonAddressDefinitions = {};
    const files = fs.readdirSync("./definitions/server/getters");
    files.forEach(path => {
      const content = fs.readFileSync(`./definitions/server/getters/${path}`, "utf8");
      const publicFunctionDefinitions = content.split("\n").filter(line => line.startsWith("export declare"));
      const componentParts = publicFunctionDefinitions.reduce((a, b) => a.concat(b)).split(/[(),]+/);
      componentParts.forEach(componentPart => {
        const variableDeclaration = componentPart.split(":", 2);
        if (variableDeclaration.length === 2) {
          const variableName = variableDeclaration[0].trim().replace("?", "");
          const variableType = variableDeclaration[1];
          const isTypeAddress = variableType.includes("Address");
          (isTypeAddress ? addressDefinitions : nonAddressDefinitions)[variableName] = "";
        }
      });
    });

    it("inputsExpectedAsAddress matches Address variables in definitions/server/getters", () => {
      const actualAddressList = Object.keys(inputsExpectedAsAddress).sort();
      const expectedAddressDefinitions = Object.keys(addressDefinitions)
        .filter(a => a !== "result") /* Result is used as a variable name of the callback only */
        .sort();
      expect(actualAddressList).to.deep.eq(expectedAddressDefinitions);
    });

    it("getter definitions do not use a variable name in inputsExpectedAsAddress which is not an address", () => {
      // If this fails you have a getter that uses an "id" variable name, but has its type as string instead of Address
      const actualAddressList = Object.keys(inputsExpectedAsAddress).sort();
      const expectedNonAddressDefinitions = Object.keys(nonAddressDefinitions)
        .sort();
      expectedNonAddressDefinitions.forEach(v => expect(actualAddressList).to.not.include(v));
    });
  });
});
