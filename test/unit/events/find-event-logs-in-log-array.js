/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var hashEventSignature = require("../../../src/events/hash-event-signature");

describe("events/find-event-logs-in-log-array", function () {
  var test = function (t) {
    it(t.description, function () {
      var findEventLogsInLogArray = proxyquire("../../../src/events/find-event-logs-in-log-array", {
        "../contracts": t.mock.contracts,
      });
      t.assertions(findEventLogsInLogArray(t.params.contractName, t.params.eventName, t.params.logs));
    });
  };
  test({
    description: "Find single MarketCreated log",
    params: {
      contractName: "Augur",
      eventName: "MarketCreated",
      logs: [{
        address: "0x4455cddf4d9bc66f595cff169d5a4f71832f6bfa",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x00000000000000000000000001114f4bda09ed6c6715cf0baf606b5bce1dc96a",
          "0x000000000000000000000000a0b82edf4028960b06e4bb919f04e83ef8cebe6a",
        ],
        data: "0x0000000000000000000000000000000000000000000000001bc16d674ec80000",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x0",
        removed: false,
      }, {
        address: "0x981ad7d64272db031468756a0332baf20d2f6198",
        topics: [
          "0x82829042141911008327ea1be4dfcc7889351f6c28646cd7cd9f91f3a3156806",
          "0x0000000000000000000000006eabb9367012c0a84473e1e6d7a7ce39a54d77bb",
          "0x0000000000000000000000004455cddf4d9bc66f595cff169d5a4f71832f6bfa",
          "0x00000000000000000000000001114f4bda09ed6c6715cf0baf606b5bce1dc96a",
        ],
        data: "0x000000000000000000000000a0b82edf4028960b06e4bb919f04e83ef8cebe6a0000000000000000000000000000000000000000000000001bc16d674ec80000",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x1",
        removed: false,
      }, {
        address: "0x4455cddf4d9bc66f595cff169d5a4f71832f6bfa",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000a0b82edf4028960b06e4bb919f04e83ef8cebe6a",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
        ],
        data: "0x0000000000000000000000000000000000000000000000001bc16d674ec80000",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x2",
        removed: false,
      }, {
        address: "0x981ad7d64272db031468756a0332baf20d2f6198",
        topics: [
          "0x82829042141911008327ea1be4dfcc7889351f6c28646cd7cd9f91f3a3156806",
          "0x0000000000000000000000006eabb9367012c0a84473e1e6d7a7ce39a54d77bb",
          "0x0000000000000000000000004455cddf4d9bc66f595cff169d5a4f71832f6bfa",
          "0x000000000000000000000000a0b82edf4028960b06e4bb919f04e83ef8cebe6a",
        ],
        data: "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd160000000000000000000000000000000000000000000000001bc16d674ec80000",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x3",
        removed: false,
      }, {
        address: "0x74e88699f5d33f516500c3d9a2430f5e6ffb0689",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
          "0x000000000000000000000000ce628f1830eec5a9951689df2473bec619ebe104",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x4",
        removed: false,
      }, {
        address: "0x74e88699f5d33f516500c3d9a2430f5e6ffb0689",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
          "0x00000000000000000000000061aeab57f7ebe0c96e12497c3da7849675b0fbb5",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x5",
        removed: false,
      }, {
        address: "0x74e88699f5d33f516500c3d9a2430f5e6ffb0689",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
          "0x000000000000000000000000746b04dce139e4cd9add3bb9513c2b0eb2b27956",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x6",
        removed: false,
      }, {
        address: "0x74e88699f5d33f516500c3d9a2430f5e6ffb0689",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
          "0x00000000000000000000000078c7dae1ed4597a43f7769c6624236f9cc312e8c",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x7",
        removed: false,
      }, {
        address: "0x74e88699f5d33f516500c3d9a2430f5e6ffb0689",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
          "0x0000000000000000000000006ba32af4a110c1ed7c8d235bef8a8fc048c2dade",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x8",
        removed: false,
      }, {
        address: "0x78e658ac4d32deafb4ba19567a13cc28549c9e1f",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
          "0x000000000000000000000000746b04dce139e4cd9add3bb9513c2b0eb2b27956",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0x9",
        removed: false,
      }, {
        address: "0xa227fc3476c56d277b8622e2ac96af44b71228b0",
        topics: [
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
          "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16",
          "0x000000000000000000000000746b04dce139e4cd9add3bb9513c2b0eb2b27956",
        ],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0xa",
        removed: false,
      }, {
        address: "0x981ad7d64272db031468756a0332baf20d2f6198",
        topics: [
          "0x6eb56ff6339181597ed10da7672cd3c735551d93d152bd072fa389317f3a0149",
          "0x0000000000000000000000006eabb9367012c0a84473e1e6d7a7ce39a54d77bb",
          "0x7370616365000000000000000000000000000000000000000000000000000000",
          "0x00000000000000000000000001114f4bda09ed6c6715cf0baf606b5bce1dc96a",
        ],
        data: "0x000000000000000000000000bb785f16f6aab68007e897ac3560378d8d6ffd16000000000000000000000000000000000000000000000000002386f2701c8d8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000006857696c6c20537061636558207375636365737366756c6c7920636f6d706c6574652061206d616e6e656420666c6967687420746f2074686520496e7465726e6174696f6e616c2053706163652053746174696f6e2062792074686520656e64206f6620323031383f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002287b227265736f6c7574696f6e536f75726365223a22687474703a2f2f7777772e7370616365782e636f6d222c2274616773223a5b22537061636558222c227370616365666c69676874225d2c226c6f6e674465736372697074696f6e223a2253706163655820686974206120626967206d696c6573746f6e65206f6e204672696461792077697468204e41534120636f6e6669726d696e67206f6e2046726964617920746861742074686520456c6f6e204d75736b2d6c656420737061636520636172676f20627573696e6573732077696c6c206c61756e636820617374726f6e6175747320746f2074686520496e7465726e6174696f6e616c2053706163652053746174696f6e20627920323031372e5c6e5c6e4c61737420796561722c20746865207370616365206167656e63792074656e7461746976656c79206177617264656420612024322e362062696c6c696f6e20636f6e747261637420746f2053706163655820746f206361727279206372657720746f2073706163652e204e415341e280997320616e6e6f756e63656d656e74206f6e2046726964617920666f726d616c697a657320746865206465616c2c20776869636820696e766f6c76657320537061636558206c6f6164696e6720697473204372657720447261676f6e2073706163656372616674207769746820617374726f6e6175747320616e642073656e64696e67207468656d206265796f6e64207468652073747261746f7370686572652e227d000000000000000000000000000000000000000000000000",
        blockNumber: "0x149eb3",
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: "0x0",
        blockHash: "0xd859203d97bdfe8c41605b9041d52fad3c4bd5c8324cafc8109cd4fba3518b78",
        logIndex: "0xb",
        removed: false,
      },
      ],
    },
    mock: {
      contracts: {
        abi: {
          events: {
            Augur: {
              MarketCreated: {
                inputs: [{
                  "indexed": true,
                  "name": "universe",
                  "type": "address",
                }, {
                  "indexed": true,
                  "name": "topic",
                  "type": "bytes32",
                }, {
                  "indexed": true,
                  "name": "marketCreator",
                  "type": "address",
                }, {
                  "indexed": false,
                  "name": "market",
                  "type": "address",
                }, {
                  "indexed": false,
                  "name": "marketCreationFee",
                  "type": "uint256",
                }, {
                  "indexed": false,
                  "name": "minPrice",
                  "type": "int256",
                }, {
                  "indexed": false,
                  "name": "maxPrice",
                  "type": "int256",
                }, {
                  "indexed": false,
                  "name": "marketType",
                  "type": "uint8",
                }, {
                  "indexed": false,
                  "name": "description",
                  "type": "string",
                }, {
                  "indexed": false,
                  "name": "extraInfo",
                  "type": "string",
                }],
                signature: hashEventSignature("MarketCreated(address,bytes32,address,address,uint256,int256,int256,uint8,string,string)"),
              },
            },
          },
        },
      },
    },
    assertions: function (logs) {
      assert.isArray(logs);
      assert.strictEqual(logs.length, 1);
      assert.deepEqual(logs, [{
        universe: "0x6eabb9367012c0a84473e1e6d7a7ce39a54d77bb",
        topic: "space",
        marketCreator: "0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a",
        market: "0xbb785f16f6aab68007e897ac3560378d8d6ffd16",
        marketCreationFee: "0.010000000006",
        minPrice: "0",
        maxPrice: "1",
        marketType: "0",
        description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
        extraInfo: {
          resolutionSource: "http://www.spacex.com",
          tags: ["SpaceX", "spaceflight"],
          longDescription: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
        },
        address: "0x981ad7d64272db031468756a0332baf20d2f6198",
        removed: false,
        transactionHash: "0xca49fcf3a4ef3fedca8bddfe0bf87e34285cc72eabbbd0f5fa6053ff209af272",
        transactionIndex: 0,
        logIndex: 11,
        blockNumber: 1351347,
        contractName: "Augur",
        eventName: "MarketCreated",
      }]);
    },
  });
});
