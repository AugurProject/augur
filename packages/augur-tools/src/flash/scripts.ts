import { makeGanacheProvider, makeGanacheServer } from "./ganache";
import { FlashSession } from "./flash";

import { ethers } from "ethers";
import * as ganache from "ganache-core";
import { EthersProvider } from "@augurproject/ethersjs-provider";

export function addScripts(flash: FlashSession) {

  flash.addScript({
    name: "create-seed-file",
    description: "Creates Ganache seed file from compiled Augur contracts.",
    options: [
      {
        name: "filepath",
        description: `Sets seed filepath. Initially set to "./seed.json"`,
        flag: false,
      },
    ],
    async call(this: FlashSession, args) {
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
    async call(this: FlashSession, args) {
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
}
