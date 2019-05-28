import { Augur } from "@augurproject/sdk";
import { providers } from "ethers";
import { computeAddress } from "ethers/utils";
import { BigNumber } from "./types";
import { Addresses } from "@augurproject/artifacts";
import { EthersProvider } from "@augurproject/ethersjs-provider";

import path from "path";

import {
  ContractDeployer,
  DeployerConfiguration,
  EthersFastSubmitWallet,
  isNetwork,
  NetworkConfiguration,
  NETWORKS
} from "@augurproject/core";
import parrotSay from "parrotsay-api";

import chalk from "chalk";
import columnify from "columnify";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { repFaucet } from "./lib/rep-faucet";
import { UploadBlockNumbers } from "@augurproject/artifacts";
import { createCannedMarketsAndOrders} from "@augurproject/test";
import { createSeedFile, seedFileIsOutOfDate } from "@augurproject/test/build/scripts/GenerateGanacheSeed";

const COMMANDS = [
  "create-markets",
  "create-orders",
  "create-markets-and-orders",
  "deploy",
  "gas-limit",
  "rep-faucet",
  "upload",
  "all-logs",
  "create-seed-file",
] as const;

type COMMANDS = typeof COMMANDS[number];

export function isCommand(x: any): x is COMMANDS {
  return COMMANDS.includes(x);
}

function help() {
  return parrotSay(" Augur Deployment Parrot ").then(function(say) {
    console.log(say);
    console.log(
      "Usage: dp <command> <network 1> <network 2> ... <network N>\n\n"
    );

    console.log(chalk.underline("Commands"));
    console.log(COMMANDS.join(", "), "or help for this message");
    console.log(
      "  NOTE: create-orders only supports " +
      chalk.bold("one network") +
      " at a time"
    );

    console.log(chalk.underline("\nNetworks"));
    console.log(NETWORKS.join(", "));

    console.log(chalk.underline("\nConfiguration"));
    console.log(
      "Set the following " +
      chalk.bold("environment constiables") +
      " to modify the behavior of the deployment process"
    );
    console.log("ex: USE_NORMAL_TIME=false dp deploy aura");

    console.log(
      chalk.underline("\nNetwork (when using `environment` for the network)")
    );
    console.log(
      columnify(
        [
          {
            env: "ETHEREUM_HTTP",
            Description:
              "The http(s) address of your ethereum endpoint (default: http://localhost:8545)"
          },
          {
            env: "AUGUR_WS",
            Description:
              "The websocket uri of your augur endpoint, only for " +
              chalk.bold("create-orders")
          },
          {
            env: "ETHEREUM_PRIVATE_KEY",
            Description:
              "HEX Private Key used for transactions on this eth node"
          },
          {
            env: "GAS_PRICE_IN_NANOETH",
            Description:
              "The transaction gas price to use, specified in nanoeth (default: consties)"
          }
        ],
        {
          columnSplitter: " - ",
          minWidth: 20,
          maxWidth: 80,
          showHeaders: false
        }
      )
    );

    console.log(chalk.underline("\nPrivate Keys (for any named environment)"));
    console.log(
      columnify(
        [
          {
            env: "AURA_PRIVATE_KEY",
            description:
              "Override key used to deploy to Aura, defaults to the dev key"
          },
          {
            env: "CLIQUE_PRIVATE_KEY",
            description:
              "Override key used to deploy to Clique, defaults to the dev key"
          },
          {
            env: "RINKEBY_PRIVATE_KEY",
            description:
              "Set key used to deploy to Rinkeby, default is blank and " +
              chalk.bold("will error if not set")
          },
          {
            env: "ROPSTEN_PRIVATE_KEY",
            description:
              "Set key used to deploy to Ropsten, default is blank and " +
              chalk.bold("will error if not set")
          },
          {
            env: "THUNDER_PRIVATE_KEY",
            description:
              "Set key used to deploy to Thunder, default is blank and " +
              chalk.bold("will error if not set")
          }
        ],
        {
          columnSplitter: " - ",
          minWidth: 20,
          maxWidth: 80,
          showHeaders: false
        }
      )
    );
    console.log(chalk.underline("\nUpload Configs"));
    console.log(
      columnify(
        [
          {
            env: "PRODUCTION",
            description:
              "[true, false] If true force USE_NORMAL_TIME to true and potentially other optimizations. (default: false)"
          },
          {
            env: "USE_NORMAL_TIME",
            description:
              "[true, false] Should time flow normally or be adjusted using the custom time management (default: true)"
          }
        ],
        {
          columnSplitter: " - ",
          minWidth: 20,
          maxWidth: 80,
          showHeaders: false
        }
      )
    );
  });
}

async function runCommandForNetwork(networkConfiguration: NetworkConfiguration, command: COMMANDS, deployerConfiguration: DeployerConfiguration) {
  switch (command) {
    case "upload": {
      if (networkConfiguration.privateKey) {
        const provider = new providers.JsonRpcProvider(networkConfiguration.http);
        const signer = await EthersFastSubmitWallet.create(networkConfiguration.privateKey, provider);
        const dependencies = new ContractDependenciesEthers(provider, signer);
        await ContractDeployer.deployToNetwork(networkConfiguration, dependencies, provider, signer, deployerConfiguration);
      }
      break;
    }
    case "rep-faucet": {
      if (networkConfiguration.privateKey) {
        const provider = new providers.JsonRpcProvider(networkConfiguration.http);
        const ethersProvider = new EthersProvider(provider, 5, 0, 40);
        const signer = await EthersFastSubmitWallet.create(networkConfiguration.privateKey, provider);
        const dependencies = new ContractDependenciesEthers(provider, signer);
        const networkId = (await provider.getNetwork()).chainId.toString();

        const addresses = Addresses[networkId];
        const augur = await Augur.create(ethersProvider, dependencies, addresses);
        await repFaucet(augur, new BigNumber(100000));
      }
      break;
    }
    case "create-markets-and-orders": {
      if (networkConfiguration.privateKey) {
        const provider = new providers.JsonRpcProvider(networkConfiguration.http);
        const ethersProvider = new EthersProvider(provider, 5, 0, 40);

        const networkId = await ethersProvider.getNetworkId();
        const addresses = Addresses[networkId];
        const accounts = [{
          secretKey: networkConfiguration.privateKey,
          publicKey: computeAddress(`0x${networkConfiguration.privateKey!}`),
          balance: 0
        }];

        console.log(JSON.stringify(accounts, null, 2));

        await createCannedMarketsAndOrders(accounts, ethersProvider, addresses);
      }
      break;
    }
    case "create-seed-file": {
      console.log("Creating ganache seed file.");
      const seedFilepath = `${__dirname}/../../../augur-test/seed.json`;
      if (await seedFileIsOutOfDate(seedFilepath)) {
        console.log("Seed file out of date. Creating/updating...");
        await createSeedFile(seedFilepath);
      } else {
        console.log("Seed file is up-to-date. No need to update.");
      }
      break;
    }
    case "gas-limit": {
      const provider = new providers.JsonRpcProvider(networkConfiguration.http);
      const ethersProvider = new EthersProvider(provider, 5, 0, 40);

      const block = await ethersProvider.getBlock("latest");
      console.log(block.gasLimit.toNumber());
      break;
    }
      case "all-logs": {
        if(networkConfiguration.privateKey) {
          const provider = new providers.JsonRpcProvider(networkConfiguration.http);
          const ethersProvider = new EthersProvider(provider, 5, 0, 40);
          const networkId = await ethersProvider.getNetworkId();

          const signer = await EthersFastSubmitWallet.create(networkConfiguration.privateKey, provider);
          const dependencies = new ContractDependenciesEthers(provider, signer);

          const addresses = Addresses[networkId];
          const { Augur: address } = Addresses[networkId];

          const uploadBlock = UploadBlockNumbers[networkId];

          const augur = await Augur.create(ethersProvider, dependencies, addresses);
          const logs = await provider.getLogs({
            address,
            fromBlock: uploadBlock,
            toBlock: "latest",
            topics: []
          });

          const logsWithBlockNumber = logs.map((log) => ({
            ...log,
            logIndex: log.logIndex || 0,
            transactionHash: log.transactionHash || "",
            transactionIndex: log.transactionIndex || 0,
            transactionLogIndex: log.transactionLogIndex || 0,
            blockNumber: (log.blockNumber || 0),
            blockHash: log.blockHash || "0",
            removed: log.removed || false
          }));

          const parsedLogs = augur.events.parseLogs(logsWithBlockNumber);
          parsedLogs.forEach((log) => console.log(JSON.stringify(log)));
        }
        break;
      }




    // case "create-orders": {
    //   if (typeof process.env.AUGUR_WS === "undefined") {
    //     console.log(
    //       "Error: Must pass augur node URI in AUGUR_WS for create-orders\n"
    //     );
    //     return help().then(function() {
    //       callback(null);
    //     });
    //   }
    //   augur.connect(
    //     {
    //       ethereumNode: {
    //         http: network.http,
    //         ws: network.ws,
    //         ipc: network.ipc
    //       },
    //       augurNode: process.env.AUGUR_WS
    //     },
    //     function(err) {
    //       if (err) return callback(err);
    //       _createOrders(augur, auth, callback);
    //     }
    //   );
    //   break;
    // }
    //
    // case "deploy": {
    //   const provider = new ethers.providers.JsonRpcProvider(network.http);
    //   EthersFastSubmitWallet.create(network.privateKey, provider).then(function(signer) {
    //     const dependencies = new ContractDependenciesEthers(provider, signer, network.gasPrice.toNumber());
    //     ContractDeployer.deployToNetwork(network, dependencies, provider, signer, deployerConfiguration).then(function() {
    //       augur.contracts.reloadAddresses(function(err) {
    //         if (err) return callback(err);
    //         augur.connect(
    //           { ethereumNode: ethereumNode },
    //           function(err) {
    //             if (err) return callback(err);
    //             // geth bug related to contract availability for estimating gas requires timeout
    //             setTimeout(function() {
    //               repFaucet(augur, 100000, auth, function(err) {
    //                 if (err) return callback(err);
    //                 createMarkets(augur, auth, callback);
    //                 callback();
    //               });
    //             }, 4000);
    //           }
    //         );
    //       });
    //     });
    //   });
    //   break;
    // }

    default: {
      help();
    }
  }
}

async function runCannedData(command: COMMANDS, networks: Array<NETWORKS>): Promise<void> {
  const deployerConfiguration = DeployerConfiguration.create(
    path.join(__dirname, "../../../augur-artifacts/src"),
    path.join(__dirname, "../../../augur-artifacts/src")
  );
  const networkConfigurations = networks.map((network) => NetworkConfiguration.create(network));
  // This is done in two steps on purpose, create validates the envs and will throw an error
  // if it doesn't work
  for (let networkConfiguration of networkConfigurations) {
    await runCommandForNetwork(networkConfiguration, command, deployerConfiguration);
  }

}

function showError(error: Error) {
  console.log("Failure!\n", error.message);
  if (error.stack) {
    console.log("-------- BACKTRACE ------");
    console.log(error.stack);
  }
  process.exit(1);
}

async function doStuff() {
  const command: string = process.argv[2];
  let networks = process.argv.slice(3).filter(isNetwork);

  if (networks.length === 0) {
    networks = ["environment"];
  }

  if (!isCommand(command)) {
    await help();
  } else {
    try {
      await runCannedData(command, networks);
    } catch (error) {
      showError(error);
    }
  }
}

if (require.main === module) {
  doStuff();
}




