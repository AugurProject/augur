"use strict";

import { IFlash, IMarket } from "../types/types"
import { UnlockedAccounts } from "../constants/accounts";
import Augur from "augur.js"
import connectionEndpoints from 'augur.js/scripts/connection-endpoints'
import pushTimestamp from 'augur.js/scripts/flash/push-timestamp'
import setAugurTimestamp from 'augur.js/scripts/flash/set-timestamp-cmd'
import { getPrivateKeyFromString } from 'augur.js/scripts/dp/lib/get-private-key'

interface IAugur {
  connect(endpoints: object, callback: Function): void
  markets: {
    getMarketsInfo(markets: object, callback: Function): void
  }
}

export default class Flash implements IFlash {
  augur: IAugur
  auth: object

  constructor() {
    this.augur = new Augur() as IAugur;
    this.auth = getPrivateKeyFromString(UnlockedAccounts.CONTRACT_OWNER_PRIV);
  }

  setMarketEndTime(marketId: string): Promise<Boolean> {
    const oThis = this
    return new Promise<Boolean>((resolve, reject) => {
      this.augur.connect(connectionEndpoints, (err: object) => {
        if (err) reject()
        this.augur.markets.getMarketsInfo({ marketIds: [marketId] }, function (err: object, marketInfos: Array<IMarket>) {
          if (err) reject()
          if (!marketInfos || marketInfos.length === 0) reject()
          const market = marketInfos[0]
          oThis.setTimestamp(market.endTime).then((result)=> {
            if (!result) return reject()
            return resolve(result)
          })
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
      this.augur.connect(connectionEndpoints, (err: object) => {
        if (err) return reject()
        func(this.augur, args, this.auth, (err: object) => {
          if (err) return reject()
          resolve(true)
        })
      })
    })
  }
}




