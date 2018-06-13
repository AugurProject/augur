"use strict";

import { UnlockedAccounts } from "../constants/accounts";
import Augur from "augur.js"
import connectionEndpoints from 'augur.js/scripts/connection-endpoints'
import pushTimestamp from 'augur.js/scripts/flash/push-timestamp'
import setTimestamp from 'augur.js/scripts/flash/set-timestamp'
import { getPrivateKeyFromString } from 'augur.js/scripts/dp/lib/get-private-key'

export default class Flash implements IFlash {
  augur: object
  auth: object

  constructor() {
    this.augur = new Augur();
    this.auth = getPrivateKeyFromString(UnlockedAccounts.CONTRACT_OWNER_PRIV);
  }

  setTimestamp(timestamp: number): Promise<Boolean> {
    const args = {
      opt: {
        timestamp:timestamp,
      }
    }
    return this.command(args, setTimestamp)
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
    return new Promise<Boolean>((resolve => {
      this.augur.connect(connectionEndpoints, (err: object) => {
        if (err) resolve(false)
        func(this.augur, args, this.auth, (err: object) => {
          if (err) resolve(false)
          resolve(true)
        })
      })
    }))
  }
}




