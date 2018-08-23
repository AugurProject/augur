"use strict";

import { IFlash } from "../types/types";
import { UnlockedAccounts } from "../constants/accounts";
import Augur from "augur.js";
import connectionEndpoints from "augur.js/scripts/connection-endpoints";
import pushTimestamp from "augur.js/scripts/flash/push-timestamp";
import setAugurTimestamp from "augur.js/scripts/flash/set-timestamp-cmd";
import forceFinalize from "augur.js/scripts/flash/force-finalize";
import tradeCompleteSets from "augur.js/scripts/flash/trade-complete-sets";
import designateReport from "augur.js/scripts/flash/designated-report";
import fillMarketOrders from "augur.js/scripts/flash/fill-market-orders";
import initialReport from "augur.js/scripts/flash/initial-report";
import disputeContribute from "augur.js/scripts/flash/dispute-contribute";
import createMarketOrder from "augur.js/scripts/flash/create-market-order";
import finalizeMarket from "augur.js/scripts/flash/finalize-market";
import { getPrivateKeyFromString } from "augur.js/scripts/dp/lib/get-private-key";

export default class Flash implements IFlash {
  augur: Augur;
  auth: object;

  constructor(contractAddress: string = UnlockedAccounts.CONTRACT_OWNER_PRIV) {
    this.augur = new Augur();
    this.auth = getPrivateKeyFromString(contractAddress);
    this.augur.connect(
      connectionEndpoints,
      (err: any) => {
        if (err) console.error("Augur could not connect");
      }
    );
  }

  dispose(): void {
    this.augur.destroy();
    this.augur = new Augur();
  }

  setMarketEndTime(marketId: string): Promise<Boolean> {
    const oThis = this;
    return new Promise<Boolean>((resolve, reject) => {
      this.augur.markets.getMarketsInfo(
        { marketIds: [marketId] },
        (err: any, marketInfos: any) => {
          if (err) reject();
          if (!marketInfos || marketInfos.length === 0) reject();
          const market = marketInfos[0];
          oThis.setTimestamp(market.endTime).then(result => {
            if (!result) return reject();
            return resolve(result);
          });
        }
      );
    });
  }

  setTimestamp(timestamp: number): Promise<Boolean> {
    const args = {
      opt: {
        timestamp: timestamp
      }
    };
    return this.command(args, setAugurTimestamp);
  }

  pushSeconds(numberOfSeconds: number) {
    const args = {
      opt: {
        count: numberOfSeconds
      }
    };
    return this.command(args, pushTimestamp);
  }

  pushDays(numberOfDays: number) {
    const args = {
      opt: {
        count: numberOfDays,
        days: true
      }
    };
    return this.command(args, pushTimestamp);
  }

  pushWeeks(numberOfWeeks: number) {
    const args = {
      opt: {
        count: numberOfWeeks,
        weeks: true
      }
    };
    return this.command(args, pushTimestamp);
  }

  forceFinalize(marketId: string) {
    const args = {
      opt: {
        marketId: marketId
      }
    };
    return this.command(args, forceFinalize);
  }

  finalizeMarket(marketId: string) {
    const args = {
      opt: {
        marketId: marketId
      }
    };
    return this.command(args, finalizeMarket);
  }

  tradeCompleteSets(marketId: string) {
    const args = {
      opt: {
        marketId: marketId,
        amount: 100000000000000000
      }
    };
    return this.command(args, tradeCompleteSets);
  }

  designateReport(marketId: string, outcome: string) {
    const args = {
      opt: {
        marketId: marketId,
        outcome: outcome
      }
    };
    return this.command(args, designateReport);
  }

  fillMarketOrders(marketId: string, outcome: string, orderType: string) {
    const args = {
      opt: {
        marketId: marketId,
        outcome: outcome,
        orderType: orderType
      }
    };
    return this.command(args, fillMarketOrders);
  }

  initialReport(
    marketId: string,
    outcome: string,
    invalid: boolean = false,
    noPush: boolean = false
  ) {
    const args = {
      opt: {
        marketId: marketId,
        outcome: outcome,
        invalid: invalid,
        noPush: noPush
      }
    };
    return this.command(args, initialReport);
  }

  disputeContribute(
    marketId: string,
    outcome: string,
    invalid: boolean = false,
    noPush: boolean = false,
    amount?: string
  ) {
    const args = {
      opt: {
        marketId: marketId,
        outcome: outcome,
        invalid: invalid,
        noPush: noPush
      }
    };

    if (amount) {
      args.opt.amount = amount;
    }
    return this.command(args, disputeContribute);
  }

  createMarketOrder(
    marketId: string,
    outcome: string,
    orderType: string,
    price: string,
    amount: string
  ) {
    const args = {
      opt: {
        marketId: marketId,
        outcome: outcome,
        orderType: orderType,
        price: price,
        amount: amount,
        useShares: false
      }
    };
    return this.command(args, createMarketOrder);
  }

  command(args: object, func: Function) {
    return new Promise<Boolean>((resolve, reject) => {
      func(this.augur, args, this.auth, (err: object) => {
        if (err) return reject();
        resolve(true);
      });
    });
  }
}
