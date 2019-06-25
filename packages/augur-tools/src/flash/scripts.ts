import { makeGanacheProvider, makeGanacheServer, deployContracts } from "./ganache";
import { FlashSession, FlashArguments } from "./flash";
import { createCannedMarketsAndOrders } from "./create-canned-markets-and-orders";
import { _100_ETH, _1_ETH } from "./constants";

import { ethers } from "ethers";
import * as ganache from "ganache-core";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { BigNumber } from "bignumber.js";

export function addScripts(flash: FlashSession) {

  flash.addScript({
    name: "create-seed-file",
    description: "Creates Ganache seed file from compiled Augur contracts.",
    options: [
      {
        name: "filepath",
        description: `Sets seed filepath. Initially set to "./seed.json"`,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      this.seedFilePath = args.filepath || this.seedFilePath;

      await this.ensureSeed();
    },
  });

  flash.addScript({
    name: "ganache",
    description: "Start a Ganache node.",
    options: [
      {
        name: "internal",
        description: "Prevent node from being available to browsers.",
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      await this.ensureSeed();

      if (args.internal) {
        this.ganacheProvider = await makeGanacheProvider(this.seedFilePath, this.accounts);
      } else {
        this.ganacheServer = await makeGanacheServer(this.seedFilePath, this.accounts);
        this.ganacheProvider = new ethers.providers.Web3Provider(this.ganacheServer.ganacheProvider);
      }

      this.provider = new EthersProvider(this.ganacheProvider, 5, 0, 40);
    },
  });

  flash.addScript({
    name: "deploy",
    description: "Upload contracts to blockchain and register them with the Augur contract.",
    options: [],
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      await this.ensureSeed();

      await deployContracts(this.provider, this.seedFilePath, this.accounts);
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

      this.market = await user.createReasonableYesNoMarket(user.augur.contracts.universe);

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

      this.market = await user.createReasonableMarket(user.augur.contracts.universe, outcomes);

      this.log(`Created market "${this.market.address}".`);
    },
  });

  flash.addScript({
    name: "create-reasonable-scalar-market",
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.market = await user.createReasonableScalarMarket(user.augur.contracts.universe);

      this.log(`Created market "${this.market.address}".`);
    },
  });

  flash.addScript({
    name: "create-canned-markets-and-orders",
    async call(this: FlashSession) {
      const user = await this.ensureUser();
      await user.faucet(new BigNumber(10).pow(18).multipliedBy(1000000));
      await createCannedMarketsAndOrders(user);
    },
  });

  flash.addScript({
    name: "all-logs",
    async call(this: FlashSession) {
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
