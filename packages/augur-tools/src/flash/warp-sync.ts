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
}
