import { NullWarpSyncHash } from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import * as fs from 'fs';
import { FlashArguments, FlashSession } from './flash';
import fetch from 'cross-fetch';
import LZString from 'lz-string';
import moment from 'moment';

export function addWarpSyncScripts(flash: FlashSession) {
  flash.addScript({
    name: 'init-warp-sync',
    async call(this: FlashSession) {
      const user = await this.createUser(this.getAccount(), this.config);
      const universeAddress = await user.augur.contracts.getOriginUniverseAddress();
      await user.initWarpSync(universeAddress);
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
    name: 'get-warp-sync-end-timestamp',
    async call(this: FlashSession) {
      this.config.flash.skipApproval = true;

      const user = await this.createUser(this.getAccount(), this.config);
      const currentBlock = await this.provider.getBlock('latest');
      const warpSyncMarket = await user.getWarpSyncMarket();
      const endTime = await warpSyncMarket.getEndTime_();

      console.log(`Current timestamp: ${currentBlock.timestamp}`);
      console.log(`Market end timestamp: ${endTime.toNumber()}`);
      console.log(`Time until expiration: ${endTime.toNumber() - currentBlock.timestamp}`);
      console.log(`or ${moment(endTime.toNumber() * 1000).from(currentBlock.timestamp * 1000)}`);

    },
  });

  flash.addScript({
    name: 'get-warp-sync-market',
    async call(this: FlashSession) {
      const user = await this.createUser(this.getAccount(), this.config);
      const warpSyncMarket = await user.getWarpSyncMarket();

      console.log(`Current warp sync market hash: ${warpSyncMarket.address}`);
    },
  });

  flash.addScript({
    name: 'get-reported-warp-sync-hash',
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);
      const warpSyncHash = await user.getReportedWarpSyncData();

      if(warpSyncHash === NullWarpSyncHash) {
        console.log('WarpSync market is uninitialized.')
        return;
      }

      console.log(warpSyncHash);
    }
  })

  flash.addScript({
    name: 'get-warp-sync-file',
    options: [
      {
        name: 'out',
        description: 'File path to write out warp sync file.',
        required: true
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const { warpSyncHash } = await user.getLastWarpSyncData();

      if(warpSyncHash === NullWarpSyncHash) {
        console.log('WarpSync market is uninitialized.')
        return;
      }

      const fileResult = await fetch(`https://cloudflare-ipfs.com/ipfs/${warpSyncHash}/index`)
        .then(item => item.arrayBuffer())
        .then(item => new Uint8Array(item))
        .then(LZString.decompressFromUint8Array)

      fs.writeFileSync(String(args.out), fileResult);
    }
  });
}
