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
      expect(addressFormatReviver("marketID", "0x0")).to.eq("0x0000000000000000000000000000000000000000");
    });

    it("null as passthrough", () => {
      expect(addressFormatReviver("marketID", null)).to.eq(null);
      expect(addressFormatReviver("not-in-whitelist", null)).to.eq(null);
    });

    it("undefined as passthrough", () => {
      expect(addressFormatReviver("marketID", undefined)).to.eq(undefined);
      expect(addressFormatReviver("not-in-whitelist", undefined)).to.eq(undefined);
    });
  });

  describe("integration of addressFormatReviver as JSON.parse reviver", () => {
    it("parse empty object", () => {
      expect(JSON.parse("{}", addressFormatReviver)).to.deep.eq({});
    });

    it("parse and format mock getCategories request (single Address)", () => {
      const mockRpcRequest = {
        id: 5,
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
        "id": 4,
        "jsonrpc": "2.0",
        "method": "getUnclaimedMarketCreatorFees",
        "params": {
          "marketIDs": ["0x0000000000000000000000000000000000000000", "0x1"],
        },
      };

      const input = JSON.stringify(mockRpcRequest);
      const expectedOutput = Object.assign({}, mockRpcRequest, { params: { marketIDs: ["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000001"] }});

      expect(JSON.parse(input, addressFormatReviver)).to.deep.eq(expectedOutput);
    });
  });

  describe("verify completeness of inputs expected to be address", () => {
    const addressVariables = {};
    const nonAddressVariables = {};
    const files = fs.readdirSync("./definitions/server/getters");
    files.forEach(path => {
      const content = fs.readFileSync(`./definitions/server/getters/${path}`, "utf8");
      const publicFunctionDefinitions = content.split("\n").filter(line => line.startsWith("export declare"));
      const componentParts = publicFunctionDefinitions.reduce((a, b) => a.concat(b)).split(/[(),]+/);
      componentParts.forEach(componentPart => {
        console.log("componentPart", componentPart);
        const variableDeclaration = componentPart.split(":", 2);
        if (variableDeclaration.length === 2) {
          const variableName = variableDeclaration[0].trim().replace("?", "");
          const variableType = variableDeclaration[1];
          const isTypeAddress = variableType.includes("Address");
          (isTypeAddress ? addressVariables : nonAddressVariables)[variableName] = "";
        }
      });
    });

    it("inputsExpectedAsAddress matches Address variables in definitions/server/getters", () => {
      const addressesThatWillBeFormatted = Object.keys(inputsExpectedAsAddress).sort();
      const allAddressVariablesInTypesDefinition = Object.keys(addressVariables).sort();
      expect(addressesThatWillBeFormatted).to.deep.eq(allAddressVariablesInTypesDefinition);
    });

    it("getter definitions do not use a variable name in inputsExpectedAsAddress which is not an address", () => {
      const addressesThatWillBeFormatted = Object.keys(inputsExpectedAsAddress).sort();
      const nonAddressVariablesInTypesDefinition = Object.keys(nonAddressVariables)
        .filter(a => a !== "result") /* Result is often used as a variable name of the function callback and can be any type */
        .sort();
      nonAddressVariablesInTypesDefinition.forEach(v => expect(addressesThatWillBeFormatted).to.not.include(v));
    });
  });
});
