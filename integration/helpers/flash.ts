"use strict";

import { UnlockedAccounts } from "../constants/accounts";
import Augur from "augur.js"
import connectionEndpoints from 'augur.js/scripts/connection-endpoints'
import pushTimestamp from 'augur.js/scripts/flash/push-timestamp'
import { getPrivateKeyFromString } from 'augur.js/scripts/dp/lib/get-private-key'

export default class Flash implements IFlash {
  augur: object
  auth: object

  constructor() {
    this.augur = new Augur();
    this.auth = getPrivateKeyFromString(UnlockedAccounts.CONTRACT_OWNER_PRIV);
  }

  pushSeconds(numberOfSeconds: number) {
    const args = {
      opt: {
        count:numberOfSeconds,
      }
    }
    return this.pushTime(args)
  }

  pushDays(numberOfDays: number) {
    const args = {
      opt: {
        count:numberOfDays,
        days:true
      }
    }
    return this.pushTime(args)
  }

  pushWeeks(numberOfWeeks: number) {
    const args = {
      opt: {
        count:numberOfWeeks,
        weeks:true
      }
    }
    return this.pushTime(args)
  }

  pushTime(args: object) {
    return new Promise<Boolean>((resolve => {
      this.augur.connect(connectionEndpoints, (err: object) => {
        if (err) resolve(false)
        pushTimestamp(this.augur, args, this.auth, (err: object) => {
          if (err) resolve(false)
          resolve(true)
        })
      })
    }))
  }
}




