import { BigNumber } from 'utils/wrapped-big-number'

import { formatEther, formatRep } from 'utils/format-number'

export default function insufficientFunds(validityBond, gasCost, creationFee, designatedReportNoShowReputationBond, availableEth, availableRep) {
  let insufficientFundsString = ''

  const BNvalidityBond = new BigNumber(formatEther(validityBond).fullPrecision)
  const BNgasCost = new BigNumber(formatEther(gasCost).fullPrecision)
  const BNcreationFee = new BigNumber(formatEther(creationFee).fullPrecision)
  const BNtotalEthCost = BNvalidityBond.plus(BNgasCost.plus(BNcreationFee))
  const insufficientEth = new BigNumber(availableEth).lt(BNtotalEthCost)

  const BNdesignatedReportNoShowReputationBond = new BigNumber(formatRep(designatedReportNoShowReputationBond).fullPrecision)
  const insufficientRep = new BigNumber(availableRep).lt(BNdesignatedReportNoShowReputationBond)

  if (insufficientEth && insufficientRep) {
    insufficientFundsString = 'ETH and REP'
  } else if (insufficientEth) {
    insufficientFundsString = 'ETH'
  } else if (insufficientRep) {
    insufficientFundsString = 'REP'
  }

  return insufficientFundsString
}
