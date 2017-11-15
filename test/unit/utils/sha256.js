/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var sha256 = require("../../../src/utils/sha256");

describe("utils/sha256", function () {
  var test = function (t) {
    it(JSON.stringify(t.hashable) + " -> " + t.digest, function () {
      assert.strictEqual(sha256(t.hashable), t.digest);
    });
  };
  test({
    hashable: [1, 2, 3],
    digest: "-0x6db4020772ce75dc29791ac402ffe01861328e29a9405a892e760684753eb441",
  });
  test({
    hashable: "0x07",
    digest: "0x77982011336d915790e77d8301a52da5654857a870de65fb16d0cb1a44820b9c",
  });
  test({
    hashable: [7],
    digest: "0x77982011336d915790e77d8301a52da5654857a870de65fb16d0cb1a44820b9c",
  });
  test({
    hashable: [1, 0, 1, 0, 1, 0, 1],
    digest: "0x26510696aacdcede7ac75a2fe403a6c5f2239e0935c2a14bb8516b0313259bb5",
  });
  test({
    hashable: [0, 0, 0, 0],
    digest: "0x67f022195ee405142968ca1b53ae2513a8bab0404d70577785316fa95218e8ba",
  });
  test({
    hashable: [17, 100, 2],
    digest: "0x7754170191064ef0aa54c18ea413326f0aefa898c03eb5651abeb1f02bb2772a",
  });
  test({
    hashable: [17, 1000, 2],
    digest: "0x12c712bd101ec252e2c7f2dd6249c118a604abdfa270f04d2ccefe091df70f24",
  });
  test({
    hashable: ["0x01", "0x11"],
    digest: "0x7a0368ef83bc9ae7912ebfc52afa1fa41fc4ecab754e60137bb0dea6681de265",
  });
  test({
    hashable: [1, 17],
    digest: "0x7a0368ef83bc9ae7912ebfc52afa1fa41fc4ecab754e60137bb0dea6681de265",
  });
  test({
    hashable: ["0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b", "0x0f69b5", "0x041e"],
    digest: "-0x1aca611fbe5cba1f22bed65740bcf56c5c74f7312d99a546b16b5c5448532406",
  });
  test({
    hashable: [
      0,
      "0xf69b5",
      1898028,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
    ],
    digest: "-0x810d6e81e51b35a4ee7c236a382c013b4ee60e6366d349a160ec67db7b873a",
  });
  test({
    hashable: ["0x7400000000000000000000000000000000000000000000000000000000000000"],
    digest: "0x7ff93b83c31a8d2f1d12ab3ac4bb212b51e63dea796528471343a34f9448ff50",
  });
  test({
    hashable: ["test"],
    digest: "-0x4149eb417dbc5fe936227211fd130ffb561775c7ff7320aa4688f5baf9f4fd36",
  });
  test({
    hashable: "test",
    digest: "-0x4149eb417dbc5fe936227211fd130ffb561775c7ff7320aa4688f5baf9f4fd36",
  });
  test({
    hashable: [0, "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1"],
    digest: "-0x34a341c67687d8449b12dcbceed3d01ed33fd6a15ee973771287a199593354e2",
  });
  test({
    hashable: [
      0,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      "0x3078313230303030303030303030303030303030",
    ],
    digest: "-0x3d4fbdd679ca32da847bff591cd22eac3386430c18cbef74c71b2419d23cbc8c",
  });
  test({
    hashable: [
      0,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      "0x3078313230303030303030303030303030303030",
      "0xf69b5",
      "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
    ],
    digest: "0xe7e9d110b87524e8ff3c3fbaebe1f0b8d0ca149a38fc20bf91992bc0bfd5235",
  });
  test({
    hashable: [
      0,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      "0x3078313230303030303030303030303030303030",
      "0xf69b5",
      "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
      1,
      120,
    ],
    digest: "0x4a2e05b8a4cb6964049429966f6cf70360fe61bb40f421f7056475810783f00d",
  });
  test({
    hashable: [
      0,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      "0x3078313230303030303030303030303030303030",
      "0xf69b5",
      "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
      1,
      120,
      "0x3078323035626330316133366532656232",
    ],
    digest: "-0x9fa5bf78a1cabb1f3d94b86b9b4c6bfc28baf2e511ff59fb33a636266b7d4ef",
  });
  test({
    hashable: [
      0,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      "0x3078313230303030303030303030303030303030",
      "0xf69b5",
      "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
      1,
      120,
      "0x3078323035626330316133366532656232",
      2,
      1054,
    ],
    digest: "0x1b2c7fceac62ef762590b8b058ee2143c78889a74f7856dd54ea91e4cc1c8f75",
  });
  test({
    hashable: [
      0,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      "0x3078313230303030303030303030303030303030",
      "0xf69b5",
      "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
      1,
      120,
      "0x3078323035626330316133366532656232",
      2,
      1054,
      "0x3078353165623835316562383531656238",
    ],
    digest: "0x5b1a0ae47238a4e1e264bfb27329f40f36df030c1022add9aa638b18821e6db8",
  });
  test({
    hashable: [
      0,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      "0x3078313230303030303030303030303030303030",
      "0xf69b5",
      "-0x5b9fcc7b08c38be45843adb61ef9ff62aa9ac003440d83112173367f88fcbe2e",
      1,
      120,
      "0x3078323035626330316133366532656232",
      2,
      1054,
      "0x3078353165623835316562383531656238",
      "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?",
    ],
    digest: "0x49419e3f50f7af3ef5300ee8cc2556903585f538550a7805b5a1fadb86851792",
  });
  test({
    hashable: ["radical-accelerations-56zrpywcyuv7vi"],
    digest: "0x5dc476bd51d117f11ed479c1a72ab923504e8de029835365f014ba86be5a3791",
  });
  test({
    hashable: [0, "radical-accelerations-56zrpywcyuv7vi"],
    digest: "0x62ab9f23b1c33cc8d6ee6e15ca7fdc39b316334f5fbf420487ee86c626eee00",
  });
  test({
    hashable: [
      0,
      "0x82a978b3f5962a5b0957d9ee9eef472ee55b42f1",
      "radical-accelerations-56zrpywcyuv7vi",
    ],
    digest: "-0x75943224e77cdf3ebe945085de00dc0aa34672c24bd93e1234dc95ffce68c88a",
  });
  test({
    hashable: [1844674407370955100],
    digest: "0x46bcc7c2725c2854bd83658adf0bf381e27e90f447dfd45eed498b68256280b4",
  });
  test({
    hashable: [1844674407370955200],
    digest: "-0x5ffec4d5b9bda3bc0a347137093725aa813f307713495c5aa02e0399bda74c40",
  });
});
