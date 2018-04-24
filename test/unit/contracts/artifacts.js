/* eslint-env mocha */
/* eslint no-unused-expressions: off */

"use strict";

var expect = require("chai").expect;
var fs = require("fs");
var path = require("path");

describe("artifacts", function () {
  it("has a well-formed addresses.json", function (done) {
    var file = fs.readFileSync(path.join(__dirname, "../../../", "./src/contracts/addresses.json"));
    expect(file).to.exist;

    var parsed = JSON.parse(file);
    expect(parsed).to.be.an("object").that.has.all.keys(["1", "3", "4", "8995", "12346", "22346", "32346"]);

    for (var networkId in parsed) {
      if (parsed.hasOwnProperty(networkId)) {
        var contracts = parsed[networkId];
        expect(contracts).to.be.an("object").that.is.not.empty;

        for (var contract in contracts) {
          if (contracts.hasOwnProperty(contract)) {
            var address = contracts[contract];
            expect(address).to.be.a("string").that.matches(/0x[a-fA-F0-9]{40}/);
          }
        }
      }
    }

    done();
  });

  it("has a well-formed upload-block-numbers.json", function (done) {
    var file = fs.readFileSync(path.join(__dirname, "../../../", "./src/contracts/upload-block-numbers.json"));
    expect(file).to.exist;

    var parsed = JSON.parse(file);
    expect(parsed).to.be.an("object").that.has.all.keys(["3", "4", "8995", "12346", "22346", "32346"]);

    for (var networkId in parsed) {
      if (parsed.hasOwnProperty(networkId)) {
        var blockNumber = parsed[networkId];
        expect(blockNumber).to.be.a("number").that.is.not.null;
      }
    }

    done();
  });
});
