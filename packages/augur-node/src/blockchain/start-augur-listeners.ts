import * as _ from "lodash";
import { Augur } from "../types";
import { logProcessors } from "./log-processors";

import { EthersProviderBlockStreamAdapter, ExtendedLog } from "blockstream-adapters";
import { Block, BlockAndLogStreamer} from "ethereumjs-blockstream";
import { BlockAndLogStreamerListener } from "@augurproject/state/build/db/BlockAndLogStreamerListener";
import { EventLogDBRouter } from "@augurproject/state/build/db/EventLogDBRouter";
import { Addresses, UploadBlockNumbers } from "@augurproject/artifacts";

export async function startAugurListeners(augur: Augur): Promise<BlockAndLogStreamerListener> {
  const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);

  const dependencies = new EthersProviderBlockStreamAdapter(augur.provider);
  const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(dependencies.getBlockByHash, dependencies.getLogs, (error: Error) => {
    console.error(error);
  });
  const uploadBlockNumber = UploadBlockNumbers[augur.networkId];
  blockAndLogStreamer.subscribeToOnBlockAdded((block)=> console.log("new block", block));

  const blockAndLogStreamerListener = new BlockAndLogStreamerListener({
    address: Addresses[augur.networkId].Augur,
    blockAndLogStreamer,
    eventLogDBRouter,
    getEventTopics: augur.events.getEventTopics,
    getBlockByHash: dependencies.getBlockByHash,
    listenForNewBlocks: dependencies.startPollingForBlocks
  });

  _.forEach(logProcessors.Augur, (value, event) => {
    const onAdd = _.partial(value.add, augur);
    const onRemove = _.partial(value.remove, augur);

    blockAndLogStreamerListener.listenForEvent(event,
      (blockIdentifier, logs=[]) => {
        logs.forEach((log) => {
          if (log["extraInfo"] != null && typeof log["extraInfo"] === "string") log["extraInfo"] = JSON.parse(log["extraInfo"])
          onAdd(log)
        });
      },
      (blockIdentifier, logs=[]) => {
        logs.forEach((log) => {
          if (log["extraInfo"] != null && typeof log["extraInfo"] === "string") log["extraInfo"] = JSON.parse(log["extraInfo"])
          onRemove(log)
        });
      });
  });

  const currentBlock = await augur.provider.getBlockNumber();

  for (let i = uploadBlockNumber; i < currentBlock; i = i + 25) {
    console.log(`Current block: ${i}`);
    const block = await dependencies.getBlockByNumber(i);
    await blockAndLogStreamerListener.onNewBlock(block);
  }

  return blockAndLogStreamerListener;
}
