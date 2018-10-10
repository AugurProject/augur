import { createBigNumber } from "utils/create-big-number";

import { formatEther, formatRep } from "utils/format-number";

export default function insufficientFunds(
  validityBond,
  gasCost,
  designatedReportNoShowReputationBond,
  availableEth,
  availableRep,
  formattedInitialLiquidityGas,
  formattedInitialLiquidityEth,
  testWithLiquidity = false
) {
  let insufficientFundsString = "";

  const BNvalidityBond = createBigNumber(
    formatEther(validityBond).fullPrecision
  );
  const BNLiqGas = createBigNumber(formattedInitialLiquidityGas);
  const BNLiqEth = createBigNumber(formattedInitialLiquidityEth);
  const BNgasCost = createBigNumber(formatEther(gasCost).fullPrecision);
  const BNtotalEthCost = testWithLiquidity
    ? BNvalidityBond.plus(BNgasCost)
        .plus(BNLiqGas)
        .plus(BNLiqEth)
    : BNvalidityBond.plus(BNgasCost);
  const insufficientEth = createBigNumber(availableEth).lt(BNtotalEthCost);

  const BNdesignatedReportNoShowReputationBond = createBigNumber(
    formatRep(designatedReportNoShowReputationBond).fullPrecision
  );
  const insufficientRep = createBigNumber(availableRep).lt(
    BNdesignatedReportNoShowReputationBond
  );

  if (insufficientEth && insufficientRep) {
    insufficientFundsString = "ETH and REP";
  } else if (insufficientEth) {
    insufficientFundsString = "ETH";
  } else if (insufficientRep) {
    insufficientFundsString = "REP";
  }

  return insufficientFundsString;
}
