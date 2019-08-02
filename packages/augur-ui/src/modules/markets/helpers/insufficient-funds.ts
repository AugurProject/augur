import { createBigNumber } from "utils/create-big-number";

import { formatEther, formatRep } from "utils/format-number";
import { ETH, DAI, REP } from "modules/common/constants";

export default function insufficientFunds(
  validityBond,
  gasCost,
  designatedReportNoShowReputationBond,
  availableEth,
  availableRep,
  availableDai,
  formattedInitialLiquidityGas,
  formattedInitialLiquidityEth,
  testWithLiquidity = false
) {
  let insufficientFundsString = "";

  const BNvalidityBond = createBigNumber(
    formatEther(validityBond).fullPrecision
  );
  const BNLiqGas = createBigNumber(formattedInitialLiquidityGas);
  const BNLiqEth = createBigNumber(formattedInitialLiquidityEth); // this is DAI actually
  const BNgasCost = createBigNumber(formatEther(gasCost).fullPrecision);
  const BNtotalEthCost = testWithLiquidity
    ? BNgasCost.plus(BNLiqGas)
        .plus(BNLiqEth)
    : BNgasCost;
  const insufficientEth = createBigNumber(availableEth || 0).lt(BNtotalEthCost);

  const BNdesignatedReportNoShowReputationBond = createBigNumber(
    formatRep(designatedReportNoShowReputationBond).fullPrecision
  );
  const insufficientRep = createBigNumber(availableRep).lt(
    BNdesignatedReportNoShowReputationBond
  );
  
  const BNtotalDaiCost = testWithLiquidity ? BNLiqEth.plus(BNvalidityBond) : BNvalidityBond;
  const insufficientDai = createBigNumber(availableDai).lt(
    BNtotalDaiCost
  );
 
  insufficientFundsString = {[ETH]: insufficientEth, [REP]: insufficientRep, [DAI]: insufficientDai};

  return insufficientFundsString;
}
