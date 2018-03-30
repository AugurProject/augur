import { WrappedBigNumber } from 'utils/wrapped-big-number'

import { formatEther, formatRep } from 'utils/format-number'

export default function insufficientFunds(validityBond, gasCost, creationFee, designatedReportNoShowReputationBond, availableEth, availableRep) {
  let insufficientFundsString = ''

  const BNvalidityBond = WrappedBigNumber(formatEther(validityBond).fullPrecision)
  const BNgasCost = WrappedBigNumber(formatEther(gasCost).fullPrecision)
  const BNcreationFee = WrappedBigNumber(formatEther(creationFee).fullPrecision)
  const BNtotalEthCost = BNvalidityBond.plus(BNgasCost.plus(BNcreationFee))
  const insufficientEth = WrappedBigNumber(availableEth).lt(BNtotalEthCost)

  const BNdesignatedReportNoShowReputationBond = WrappedBigNumber(formatRep(designatedReportNoShowReputationBond).fullPrecision)
  const insufficientRep = WrappedBigNumber(availableRep).lt(BNdesignatedReportNoShowReputationBond)

  if (insufficientEth && insufficientRep) {
    insufficientFundsString = 'ETH and REP'
  } else if (insufficientEth) {
    insufficientFundsString = 'ETH'
  } else if (insufficientRep) {
    insufficientFundsString = 'REP'
  }

  return insufficientFundsString
}
