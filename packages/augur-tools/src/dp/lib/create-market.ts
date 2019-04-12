import chalk from "chalk";
import immutableDelete from "immutable-delete";
import { printTransactionStatus } from "./print-transaction-status";
import speedomatic from "speedomatic";

export function createMarket(
  augur,
  market,
  designatedReporterAddress,
  auth,
  callback
) {
  let createMarketOfType;
  switch (market.marketType) {
    case "categorical":
      createMarketOfType = augur.createMarket.createCategoricalMarket;
      break;
    case "scalar":
      createMarketOfType = augur.createMarket.createScalarMarket;
      break;
    case "yesNo":
    default:
      createMarketOfType = augur.createMarket.createYesNoMarket;
  }

  const createMarketParams = Object.assign(
    {},
    immutableDelete(market, ["orderBook", "marketType"]),
    {
      meta: auth,
      universe: augur.contracts.addresses[augur.rpc.getNetworkID()].Universe,
      _feePerEthInWei: speedomatic.fix(0.01, "hex"),
      _affiliateFeeDivisor: market._affiliateFeeDivisor,
      _designatedReporterAddress: designatedReporterAddress,
      onSent: function(res) {
        console.log(
          chalk.green.dim("createMarket sent:"),
          chalk.green(res.hash)
        );
      },
      onSuccess: function(res) {
        console.log(
          chalk.green.dim("createMarket success:"),
          chalk.green(res.callReturn)
        );
        printTransactionStatus(augur.rpc, res.hash);
        callback(null, res.callReturn);
      },
      onFailed: function(err) {
        console.error(chalk.red.bold("createMarket failed:"), err, market);
        if (err != null) printTransactionStatus(augur.rpc, err.hash);
        callback(err);
      }
    }
  );
  console.log("createMarket params:", createMarketParams);
  createMarketOfType(createMarketParams);
}

