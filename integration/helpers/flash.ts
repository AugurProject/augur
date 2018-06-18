"use strict";

import { IFlash } from "../types/types"
import { UnlockedAccounts } from "../constants/accounts";
import Augur from "augur.js"
import connectionEndpoints from 'augur.js/scripts/connection-endpoints'
import pushTimestamp from 'augur.js/scripts/flash/push-timestamp'
import setAugurTimestamp from 'augur.js/scripts/flash/set-timestamp-cmd'
import { getPrivateKeyFromString } from 'augur.js/scripts/dp/lib/get-private-key'

export default class Flash implements IFlash {
  augur: Augur
  auth: object

  constructor() {
    this.augur = new Augur();
    this.auth = getPrivateKeyFromString(UnlockedAccounts.CONTRACT_OWNER_PRIV);
    this.augur.connect(connectionEndpoints, (err: any) => {
      if (err) console.error("Augur could not connect")
    })
  }

  dispose(): void {
    this.augur.destroy()
    this.augur = new Augur()
  }

  setMarketEndTime(marketId: string): Promise<Boolean> {
    const oThis = this
    return new Promise<Boolean>((resolve, reject) => {
      this.augur.markets.getMarketsInfo({ marketIds: [marketId] }, (err: any, marketInfos: any ) => {
        if (err) reject()
        if (!marketInfos || marketInfos.length === 0) reject()
        const market = marketInfos[0]
        oThis.setTimestamp(market.endTime).then((result)=> {
          if (!result) return reject()
          return resolve(result)
        })
      })
    })
  }

  setTimestamp(timestamp: number): Promise<Boolean> {
    const args = {
      opt: {
        timestamp:timestamp,
      }
    }
    return this.command(args, setAugurTimestamp)
  }

  pushSeconds(numberOfSeconds: number) {
    const args = {
      opt: {
        count:numberOfSeconds,
      }
    }
    return this.command(args, pushTimestamp)
  }

  pushDays(numberOfDays: number) {
    const args = {
      opt: {
        count:numberOfDays,
        days:true
      }
    }
    return this.command(args, pushTimestamp)
  }

  pushWeeks(numberOfWeeks: number) {
    const args = {
      opt: {
        count:numberOfWeeks,
        weeks:true
      }
    }
    return this.command(args, pushTimestamp)
  }

  command(args: object, func: Function) {
    return new Promise<Boolean>((resolve, reject) => {
      func(this.augur, args, this.auth, (err: object) => {
        if (err) return reject()
        resolve(true)
      })
    })
  }
}




