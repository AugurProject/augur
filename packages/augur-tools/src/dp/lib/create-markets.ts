import { Augur } from "@augurproject/api";
import chalk from "chalk";
import { createMarket } from "./create-market";
import { cannedMarketsData } from "../data/canned-markets";
import { Addresses } from "@augurproject/artifacts";
import { BigNumber, Event } from "../types";
import { EthersFastSubmitWallet } from "@augurproject/core";

interface MarketCreatedEvent extends Event {
  parameters: {
    market:string;
  }
}

export async function createMarkets(augur:Augur<BigNumber>, address:string, signer: EthersFastSubmitWallet) {
  console.log(chalk.cyan("Network"), chalk.green(augur.networkId));
  console.log(chalk.cyan("Account"), chalk.green(address));

  const ethBalance = await signer.getBalance('latest');
  const repBalance = await augur.contracts.cash.balanceOf_(address);

  console.log(chalk.cyan("Balances:"));
  console.log("Ether:      " + chalk.green(ethBalance.toString()));
  console.log("Reputation: " + chalk.green(repBalance.toString()));

  for(let market of cannedMarketsData) {
    const events = await createMarket(augur, market, address);
    const marketCreatedEvent = <MarketCreatedEvent>events.find((event) => event.name === "MarketCreated");

    console.log(chalk.green(chalk.cyan.dim(market._extraInfo.description), JSON.stringify(marketCreatedEvent.parameters.market)));

    if (process.env.NO_CREATE_ORDERS) continue;
    // createOrderBook(augur, marketId, numOutcomes, market._maxPrice || "1", market._minPrice || "0", numTicks, market.orderBook, auth, nextMarket);
  }
// }
//
//     let cash = Addresses[augur.networkId].Cash;
//     augur.api.Cash.depositEther({
//       meta: auth, tx: {
//         to: cash,
//         value: speedomatic.fix(9999)
//       },
//       onSent: function() {
//       },
//       onFailed: function(err) {
//         console.error("Augur.approve failed:", err);
//         callback(err);
//       },
//       onSuccess: function() {
//         approveAugurEternalApprovalValue(augur, auth.address, auth, function(err) {
//           if (err) return console.error("approveAugurEternalApprovalValue failed:", err);
//           console.log(chalk.cyan("Creating canned markets..."));
//
//
//
//           }, callback);
//         });
//       }
//     });
//   });
}

