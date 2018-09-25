/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var sha3 = require("../../../src/utils/sha3");

describe("utils/sha3", function () {
  var test = function (t) {
    it(JSON.stringify(t.hashable) + " -> " + t.digest, function () {
      assert.strictEqual(sha3(t.hashable), t.digest);
    });
  };
  test({
    hashable: [1, 2, 3],
    digest: speedomatic.unfork("0x6e0c627900b24bd432fe7b1f713f1b0744091a646a9fe4a65a18dfed21f2949c", true),
  });
  test({
    hashable: [1, 0, 1, 0, 1, 0, 1],
    digest: speedomatic.unfork("0x1c9ace216ac502aa2f386dcce536fe05590090d2cd93768cf21f865677c2da96", true),
  });
  test({
    hashable: [7],
    digest: speedomatic.unfork("-0x599336d74a1247d50642b66dd6abeaa5484f6bd96b415b31bb99e26578c93978", true),
  });
  test({
    hashable: [0, 0, 0, 0],
    digest: speedomatic.unfork("0x12893657d8eb2efad4de0a91bcd0e39ad9837745dec3ea923737ea803fc8e3d", true),
  });
  test({
    hashable: [17, 100, 2],
    digest: speedomatic.unfork("0x72f4bbc5353724cebd20d6f15e3d2bd10e75ed59cec54724ab5a6d5ad9955d3", true),
  });
  test({
    hashable: [17, 1000, 2],
    digest: speedomatic.unfork("-0xfa1338534aa300ca79cf8b1123ed99a9634b1f9e475b24ea0c7a659ae701378", true),
  });
  test({
    hashable: ["0x01", "0x11"],
    digest: speedomatic.unfork("0x17bc176d2408558f6e4111feebc3cab4e16b63e967be91cde721f4c8a488b552", true),
  });
  test({
    hashable: ["0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b", "0x0f69b5", "0x041e"],
    digest: speedomatic.unfork("0x74d1c32fb4ba921c884e82504171fcc503c4488680dcd68f61af2e4732daa191", true),
  });
  test({
    hashable: [
      0,
      "0xf69b5",
      1898028,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
    ],
    digest: speedomatic.unfork("-0xec24e44d7005689c9e1ccbfecfcedb2665abe2940e585659600fcb896574dc7", true),
  });
  test({
    hashable: [
      0,
      "0xf69b5",
      1898028,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      speedomatic.fix(42, "hex"),
      0,
      120,
      2,
    ],
    digest: speedomatic.unfork("0x751b23d114539a8c91a7b0671820324fc6300ab4ef1e090db5c71dd0d1dd0e14", true),
  });
  test({
    hashable: ["0x7400000000000000000000000000000000000000000000000000000000000000"],
    digest: speedomatic.unfork("-0x1cf1192d502c2567785a27e617208c466a1fad592636b17ee99448dec3784481", true),
  });
  test({
    hashable: [
      0,
      "0xf69b5",
      1898028,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      speedomatic.fix(42, "hex"),
      0,
      120,
      2,
      "test",
    ],
    digest: speedomatic.unfork("-0x30ad844951eec4d0b5d543252391a6d4bb23b9f67f406f3f8a4203652b0d8cb3", true),
  });
  test({
    hashable: [
      0,
      "0xf69b5",
      1898028,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      speedomatic.fix(42, "hex"),
      0,
      120,
      2,
      "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?",
    ],
    digest: speedomatic.unfork("0x4da29b50a48cab4bd45d4bbef3a671083467a415109896a35c8e390bc561b237", true),
  });
  test({
    hashable: ["为什么那么认真？"],
    digest: speedomatic.unfork("-0x19f33f90843772d67526450f0e0cf15ab06020001a2ae7c6437fcbee24257d6e", true),
  });
  test({
    hashable: ["なぜそんなに真剣なんだ？ €☃..."],
    digest: speedomatic.unfork("0x2f77daf73854def6e1ed2edc9ed222f94387e1f2438f960720e96e902a6b20d2", true),
  });
  test({
    hashable: [
      "0x1708aec800",
      "0x51eb851eb851eb8",
      "0x574aad9e",
      "0x7765617468657200000000000000000000000000000000000000000000000000",
      "0x74656d7065726174757265000000000000000000000000000000000000000000",
      "0x636c696d617465206368616e6765000000000000000000000000000000000000",
      "0x159823db800",
      "0x18",
      "为什么那么认真？",
    ],
    digest: speedomatic.unfork("0x2e7cf821ee4c26d268ed5a11a187efa9baa417544159759c1ab310868b5a4dfb", true),
  });
  test({
    hashable: [
      "0x1708aec800",
      "0x51eb851eb851eb8",
      "0x574aad9e",
      "0x7765617468657200000000000000000000000000000000000000000000000000",
      "0x74656d7065726174757265000000000000000000000000000000000000000000",
      "0x636c696d617465206368616e6765000000000000000000000000000000000000",
      "0x159823db800",
      "0x2e",
      "なぜそんなに真剣なんだ？ €☃...",
    ],
    digest: speedomatic.unfork("0x2901f3d513d2259272700e2487c075e50c206a24069a3c83eb19de1738439508", true),
  });
  test({
    hashable: "-0x076627fd562b1cc22a6e53ae38d5d421fb3af7fe6c1f18164d097100fba627c54",
    digest: speedomatic.unfork("-0x1de19444afd83f9be817472f4dc48418cbe33a43a02c2288c5b4ebb12aafc147", true),
  });
});
