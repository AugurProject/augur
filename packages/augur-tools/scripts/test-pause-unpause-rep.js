#!/usr/bin/env node
// Mainnet: ETHEREUM_HTTP=https://mainnet.infura.io/LeFqkjRiuWeaiRLkiSoe scripts/test-pause-unpause-rep.js /path/to/547381A12FFB48D0/UTC--2017-07-28T00-11-07.493299334Z--7e614ec62cfd5761f20a9c5a2fe2bc0ac7431918
// Ropsten: ETHEREUM_HTTP=https://ropsten.infura.io/LeFqkjRiuWeaiRLkiSoe scripts/test-pause-unpause-rep.js ~/.ethereum-3/testnet/keystore/UTC--2016-02-22T09-35-30.770388809Z--15f6400a88fb320822b689607d425272bea2175f

"use strict";

var chalk = require("chalk");
var speedomatic = require("speedomatic");
var Augur = require("augur.js");
var getPrivateKey = require("./dp/lib/get-private-key").getPrivateKey;
var debugOptions = require("./debug-options");

// var serpentReputationToken = {
//   1: "0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5",
//   3: "0x7a305d9B681Fb164dc5AD628B5992177dC66AEC8",
//   4: "0xbc48f2465515f4a2b9154ad66ff487497128c6e7",
// };

var legacyReputationToken = {
  1: {
    contractAddress: "0xe94327d07fc17907b4db788e5adf2ed424addff6",
    ownerAddress: "0x7e614ec62cfd5761f20a9c5a2fe2bc0ac7431918"
  },
  3: {
    contractAddress: "0xf0079d20CD280c7f3D88d0803aA33EB29fd42712",
    ownerAddress: "0x15f6400A88fB320822b689607d425272bEa2175f"
  },
  4: {
    contractAddress: "0x01f72Ef9f920056F40DE19C6940ba571BAe1aB7F",
    ownerAddress: "0x01114f4Bda09ED6c6715CF0BAf606B5bCE1Dc96a"
  }
};

var LEGACY_REPUTATION_TOKEN_TEST_TRANSFER_RECIPIENT =
  "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c";

var augur = new Augur();
augur.rpc.setDebugOptions(debugOptions);

var keystoreFilePath = process.argv[2];

augur.connect(
  { ethereumNode: { http: process.env.ETHEREUM_HTTP } },
  function(err) {
    if (err) return console.error(err);
    var networkId = augur.rpc.getNetworkID();
    console.log(chalk.cyan.dim("network ID:"), chalk.cyan(networkId));
    if (networkId === "1") {
      console.error("Comment out this check to pause REP on mainnet!");
      process.exit(1);
    }
    getPrivateKey(keystoreFilePath, function(err, auth) {
      if (err) return console.error(err);
      augur.api.LegacyReputationToken.balanceOf(
        {
          _owner: auth.address,
          tx: { to: legacyReputationToken[networkId].contractAddress }
        },
        function(err, legacyReputationTokenBalance) {
          if (err) return console.error(err);
          console.log(
            "LegacyReputationToken balance:",
            speedomatic.unfix(legacyReputationTokenBalance, "string")
          );
          var testLegacyReputationTokenTransferPayload = {
            _to: LEGACY_REPUTATION_TOKEN_TEST_TRANSFER_RECIPIENT,
            _value: "0x1",
            meta: auth,
            tx: { to: legacyReputationToken[networkId].contractAddress }
          };
          console.log(
            chalk.blue.bold("\nPre-pause LegacyReputationToken.transfer...")
          );
          augur.api.LegacyReputationToken.transfer(
            Object.assign({}, testLegacyReputationTokenTransferPayload, {
              onSent: function(res) {
                console.log("LegacyReputationToken.transfer sent", res.hash);
              },
              onSuccess: function(res) {
                console.log("LegacyReputationToken.transfer success", res);
                console.log(
                  chalk.blue.bold("\nLegacyReputationToken.pause...")
                );
                augur.api.LegacyReputationToken.pause({
                  meta: auth,
                  tx: { to: legacyReputationToken[networkId].contractAddress },
                  onSent: function(res) {
                    console.log("LegacyReputationToken.pause sent", res.hash);
                  },
                  onSuccess: function(res) {
                    console.log("LegacyReputationToken.pause success", res);
                    console.log(
                      chalk.blue.bold(
                        "\nPost-pause LegacyReputationToken.transfer..."
                      )
                    );
                    augur.api.LegacyReputationToken.transfer(
                      Object.assign(
                        {},
                        testLegacyReputationTokenTransferPayload,
                        {
                          onSent: function(res) {
                            console.log(
                              "Post-pause LegacyReputationToken.transfer sent",
                              res.hash
                            );
                          },
                          onSuccess: function(res) {
                            console.error(
                              chalk.red.bold(
                                "Post-pause LegacyReputationToken.transfer succeeded (expected failure)"
                              ),
                              res
                            );
                            process.exit(1);
                          },
                          onFailed: function(err) {
                            console.log(
                              "Post-pause LegacyReputationToken.transfer failed as expected",
                              err
                            );
                            process.exit(0);
                            // console.log(chalk.blue.bold("\nLegacyReputationToken.unpause..."));
                            // augur.api.LegacyReputationToken.unpause({
                            //   meta: auth,
                            //   tx: { to: legacyReputationToken[networkId].contractAddress },
                            //   onSent: function (res) {
                            //     console.log("LegacyReputationToken.unpause sent", res.hash);
                            //   },
                            //   onSuccess: function (res) {
                            //     console.log("LegacyReputationToken.unpause success", res);
                            //     console.log(chalk.blue.bold("\nPost-unpause LegacyReputationToken.transfer..."));
                            //     augur.api.LegacyReputationToken.transfer(Object.assign({}, testLegacyReputationTokenTransferPayload, {
                            //       onSent: function (res) {
                            //         console.log("Post-unpause LegacyReputationToken.transfer sent", res.hash);
                            //       },
                            //       onSuccess: function (res) {
                            //         console.log("Post-unpause LegacyReputationToken.transfer success", res);
                            //         process.exit(0);
                            //       },
                            //       onFailed: function (err) {
                            //         console.error(chalk.red.bold("Post-unpause LegacyReputationToken.transfer failed"), err);
                            //         process.exit(1);
                            //       },
                            //     }));
                            //   },
                            //   onFailed: function (err) {
                            //     console.error(chalk.red.bold("LegacyReputationToken.unpause failed"), err);
                            //     process.exit(1);
                            //   },
                            // });
                          }
                        }
                      )
                    );
                  },
                  onFailed: function(err) {
                    console.error(
                      chalk.red.bold("LegacyReputationToken.pause failed"),
                      err
                    );
                    process.exit(1);
                  }
                });
              },
              onFailed: function(err) {
                console.error(
                  chalk.red.bold("LegacyReputationToken.transfer failed"),
                  err
                );
                process.exit(1);
              }
            })
          );
        }
      );
    });
  }
);
