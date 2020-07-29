import { createBigNumber } from "utils/create-big-number";

import { formatEther, formatRep, formatGasCostToEther } from "utils/format-number";
import { ETH, DAI, REP } from "modules/common/constants";

export interface InsufficientFunds {
  [ETH]?: boolean;
  [REP]?: boolean;
  [DAI]?: boolean;
}

export default function findInsufficientFunds(
  validityBond,
  gasCost,
  designatedReportNoShowReputationBond,
  availableEth,
  availableRep,
  availableDai,
  formattedInitialLiquidityGas,
  formattedInitialLiquidityDai,
): InsufficientFunds {
  const BNGasCost = createBigNumber(gasCost);
  const BNvalidityBond = createBigNumber(
    formatEther(validityBond).fullPrecision
  );
  const BNLiqGas = createBigNumber(formattedInitialLiquidityGas);
  const BNLiqDai = createBigNumber(formattedInitialLiquidityDai);
  const BNtotalEthCost = BNLiqGas.plus(BNGasCost);

  const insufficientEth = createBigNumber(availableEth || 0).lt(BNtotalEthCost);

  const BNdesignatedReportNoShowReputationBond = createBigNumber(
    formatRep(designatedReportNoShowReputationBond).fullPrecision
  );
  const insufficientRep = createBigNumber(availableRep).lt(
    BNdesignatedReportNoShowReputationBond
  );

  const BNtotalDaiCost = BNLiqDai.plus(BNvalidityBond);
  const insufficientDai = createBigNumber(availableDai).lt(
    BNtotalDaiCost
  );

  return {[ETH]: insufficientEth, [REP]: insufficientRep, [DAI]: insufficientDai};
}
