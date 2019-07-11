import { deployContracts } from "../libs/blockchain";
import { FlashSession, FlashArguments } from "./flash";
import { createCannedMarketsAndOrders } from "./create-canned-markets-and-orders";
import { _1_ETH } from "../constants";
import { Contracts as compilerOutput, Addresses } from "@augurproject/artifacts";
import { NetworkConfiguration, NETWORKS } from "@augurproject/core";

import { BigNumber } from "bignumber.js";

export function addScripts(flash: FlashSession) {

  flash.addScript({
    name: "connect",
    description: "Connect to an Ethereum node.",
    options: [
      {
        name: "network",
        description: `Which network to connect to. Defaults to "environment" aka local node.`,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const network = args.network as NETWORKS || "environment";

      const networkConfiguration = NetworkConfiguration.create(network);
      flash.provider = this.makeProvider(networkConfiguration);
      const networkId = await this.getNetworkId(flash.provider);
      flash.contractAddresses = Addresses[networkId];
    },
  });

  flash.addScript({
    name: "deploy",
    description: "Upload contracts to blockchain and register them with the Augur contract.",
    options: [
      {
        name: "write-artifacts",
        description: "Overwrite addresses.json.",
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const writeArtifacts = args.write_artifacts as boolean;
      if (this.noProvider()) return;

      await deployContracts(this.provider, this.accounts, compilerOutput, writeArtifacts);
    },
  });

  flash.addScript({
    name: "faucet",
    description: "Mints Cash tokens for user.",
    options: [
      {
        name: "amount",
        description: "Quantity of Cash.",
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);

      await user.faucet(atto);
    },
  });

  flash.addScript({
    name: "rep-faucet",
    description: "Mints REP tokens for user.",
    options: [
      {
        name: "amount",
        description: "Quantity of REP.",
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);

      await user.repFaucet(atto);
    },
  });

  flash.addScript({
    name: "gas-limit",
    async call(this: FlashSession) {
      if (this.noProvider()) return;

      const block = await this.provider.getBlock("latest");
      this.log(`Gas limit: ${block.gasLimit.toNumber()}`);
    },
  });

  flash.addScript({
    name: "create-reasonable-yes-no-market",
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.market = await user.createReasonableYesNoMarket();

      this.log(`Created market "${this.market.address}".`);
    },
  });

  flash.addScript({
    name: "create-reasonable-categorical-market",
    options: [
      {
        name: "outcomes",
        description: "Comma-separated.",
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const outcomes: string[] = (args.outcomes as string).split(",");

      this.market = await user.createReasonableMarket(outcomes);

      this.log(`Created market "${this.market.address}".`);
    },
  });

  flash.addScript({
    name: "create-reasonable-scalar-market",
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.market = await user.createReasonableScalarMarket();

      this.log(`Created market "${this.market.address}".`);
    },
  });

  flash.addScript({
    name: "create-canned-markets-and-orders",
    async call(this: FlashSession) {
      const user = await this.ensureUser();
      await user.faucet(new BigNumber(10).pow(18).multipliedBy(1000000));
      return createCannedMarketsAndOrders(user);
    },
  });

  flash.addScript({
    name: "all-logs",
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const logs = await this.provider.getLogs({
        address: user.augur.addresses.Augur,
        fromBlock: 0, // TODO programmatically figure out which block number augur was uploaded to
        toBlock: "latest",
        topics: [],
      });

      const logsWithBlockNumber = logs.map((log) => ({
        ...log,
        logIndex: log.logIndex || 0,
        transactionHash: log.transactionHash || "",
        transactionIndex: log.transactionIndex || 0,
        transactionLogIndex: log.transactionLogIndex || 0,
        blockNumber: (log.blockNumber || 0),
        blockHash: log.blockHash || "0",
        removed: log.removed || false,
      }));

      const parsedLogs = user.augur.events.parseLogs(logsWithBlockNumber);
      parsedLogs.forEach((log) => this.log(JSON.stringify(log, null, 2)));
    },
  });
}
