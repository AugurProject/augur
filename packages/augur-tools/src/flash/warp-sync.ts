import { NullWarpSyncHash } from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import { FlashArguments, FlashSession } from './flash';

export function addWarpSyncScripts(flash: FlashSession) {
  flash.addScript({
    name: 'init-warp-sync',
    async call(this: FlashSession) {
      const user = await this.createUser(this.getAccount(), this.config);
      await user.initWarpSync(user.augur.contracts.universe.address);
    },
  });

  flash.addScript({
    name: 'get-current-warp-sync-hash',
    async call(this: FlashSession) {
      const user = await this.createUser(this.getAccount(), this.config);
      const { warpSyncHash } = await user.getLastWarpSyncData();

      if(warpSyncHash === NullWarpSyncHash) {
        console.log('WarpSync market is uninitialized.')
        return;
      }

      console.log(`Current WarpSyncHash: ${warpSyncHash}\n`)
    },
  });

  flash.addScript({
    name: 'report-warp-sync',
    options: [
      {
        name: 'hash',
        abbr: 'h',
        description: 'warp sync hash to report',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const hash = args.hash as string;
      const user = await this.createUser(this.getAccount(), this.config);
      await user.reportWarpSyncMarket(hash);
    },
  });

  flash.addScript({
    name: 'get-warp-sync-end-timestamp',
    async call(this: FlashSession) {
      const user = await this.createUser(this.getAccount(), this.config);
      const warpSyncMarket = await user.getWarpSyncMarket();

      const endTime = await warpSyncMarket.getEndTime_();

      console.log(endTime.toNumber());
    },
  });

  flash.addScript({
    name: 'report-and-finalize-warp-sync',
    options: [
      {
        name: 'hash',
        abbr: 'h',
        description: 'warp sync hash to report',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const hash = args.hash as string;
      const user = await this.createUser(this.getAccount(), this.config);
      await user.reportAndFinalizeWarpSyncMarket(hash);
    },
  });

  flash.addScript({
    name: 'mine',
    options: [
      {
        name: 'count',
        abbr: 'c',
        description: 'Mine a certain number of blocks. Only works against ganache.',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const count = Number(args.count);
      const user = await this.createUser(this.getAccount(), this.config);
      for (let i = 1;i < count;i++) {
        await user.advanceTimestamp(new BigNumber(10));
        console.log(`Advancing block ${i} of ${count}`);
      }
    },
  });
}
