import { augur } from 'services/augurjs'
import speedomatic from 'speedomatic'
import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { DESIGNATED_REPORTER_SELF } from 'modules/create-market/constants/new-market-constraints'

export const buildCreateMarket = (newMarket, isEstimate, universe, loginAccount, contractAddresses) => {
  const tags = []
  if (newMarket.tag1) tags.push(newMarket.tag1)
  if (newMarket.tag2) tags.push(newMarket.tag2)

  const formattedNewMarket = {
    universe: universe.id,
    _endTime: parseInt(newMarket.endTime.timestamp, 10),
    _feePerEthInWei: speedomatic.fix(newMarket.settlementFee / 100, 'hex'),
    _denominationToken: contractAddresses.Cash,
    _description: newMarket.description,
    _designatedReporterAddress: newMarket.designatedReporterType === DESIGNATED_REPORTER_SELF ? loginAccount.address : newMarket.designatedReporterAddress,
    _topic: newMarket.category,
    _extraInfo: {
      longDescription: newMarket.detailsText,
      resolutionSource: newMarket.expirySource,
      tags,
    },
  }

  if (isEstimate) {
    formattedNewMarket.tx = { estimateGas: true, gas: augur.constants.DEFAULT_MAX_GAS }
  }
  let createMarket
  switch (newMarket.type) {
    case CATEGORICAL:
      formattedNewMarket._outcomes = newMarket.outcomes.filter(outcome => outcome !== '')
      createMarket = augur.createMarket.createCategoricalMarket
      break
    case SCALAR:
      formattedNewMarket.tickSize = newMarket.tickSize
      formattedNewMarket._minPrice = newMarket.scalarSmallNum.toString()
      formattedNewMarket._maxPrice = newMarket.scalarBigNum.toString()
      formattedNewMarket._extraInfo._scalarDenomination = newMarket.scalarDenomination
      createMarket = augur.createMarket.createScalarMarket
      break
    case YES_NO:
    default:
      createMarket = augur.createMarket.createYesNoMarket
  }

  return { createMarket, formattedNewMarket }

}
