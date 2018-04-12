import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import logError from 'utils/log-error'

import { selectReportableOutcomes } from 'modules/reports/selectors/reportable-outcomes'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'
import { SCALAR } from 'modules/markets/constants/market-types'

export default function (callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount, marketsData } = getState()
    const universeId = universe.id || UNIVERSE_ID

    const universeData = {
      market: null,
      id: universeId,
      reportableOutcomes: null,
      winningChildUniverseId: null,
    }

    if (universe.isForking) {
      const forkingMarket = marketsData[universe.forkingMarket]
      universeData.market = forkingMarket
      universeData.reportableOutcomes = selectReportableOutcomes(forkingMarket.marketType, forkingMarket.outcomes)
      universeData.winningChildUniverseId = universe.winningChildUniverse
    }

    augur.api.Universe.getParentUniverse({ tx: { to: universeId } }, (err, parentUniverseId) => {
      if (err) return callback(err)

      if (parentUniverseId === '0x0000000000000000000000000000000000000000') {
        return getUniversesInfoWithParentContext(loginAccount.address, universeData, { id: parentUniverseId }, { id: parentUniverseId }, callback)
      }

      getUniverseInfo(parentUniverseId, (err, parentUniverseData) => {
        if (err) return callback(err)

        augur.api.Universe.getParentUniverse({ tx: { to: parentUniverseData.id } }, (err, grandParentUniverseId) => {
          if (err) return callback(err)

          if (grandParentUniverseId === '0x0000000000000000000000000000000000000000') {
            return getUniversesInfoWithParentContext(loginAccount.address, universeData, parentUniverseData, { id: grandParentUniverseId }, callback)
          }

          getUniverseInfo(grandParentUniverseId, (err, grandParentUniverseData) => {
            if (err) return callback(err)
            return getUniversesInfoWithParentContext(loginAccount.address, universeData, parentUniverseData, grandParentUniverseData, callback)
          })
        })
      })
    })
  }
}

function getUniverseInfo(universeId, callback) {
  const universeData = {
    id: universeId,
    reportableOutcomes: null,
    winningChildUniverseId: null,
    market: null,
  }

  augur.api.Universe.getForkingMarket({ tx: { to: universeId } }, (err, forkingMarket) => {
    if (err) return callback(err)
    augur.markets.getMarketsInfo({ marketIds: [forkingMarket] }, (err, marketsDataArray) => {
      if (err) return callback(err)
      universeData.market = marketsDataArray[0]
      universeData.reportableOutcomes = selectReportableOutcomes(universeData.market.marketType, universeData.market.outcomes)
      augur.api.Market.isFinalized({ tx: { to: forkingMarket } }, (err, isForkingMarketFinalized) => {
        if (err) return callback(err)
        if (!isForkingMarketFinalized) {
          return callback(null, universeData)
        }
        augur.api.Universe.getWinningChildUniverse({ tx: { to: universeId } }, (err, winningChildUniverse) => {
          if (err) return callback(err)
          universeData.winningChildUniverseId = winningChildUniverse
          return callback(null, universeData)
        })
      })
    })
  })
}

function getUniversesInfoWithParentContext(account, currentUniverseData, parentUniverseData, grandParentUniverseData, callback) {
  augur.augurNode.submitRequest(
    'getUniversesInfo',
    {
      universe: currentUniverseData.id,
      account,
    }, (err, result) => {
      if (err) return callback(err)
      const initialMapping = {
        parent: null,
        children: [],
        currentLevel: [],
      }
      callback(result.reduce((acc, universeData) => {
        if (universeData.parentUniverse === currentUniverseData.id) {
          universeData.description = getUniverseName(currentUniverseData, universeData)
          universeData.isWinningUniverse = currentUniverseData.winningChildUniverseId === universeData.universe
          acc.children.push(universeData)
        } else if (universeData.parentUniverse === parentUniverseData.id) {
          universeData.description = getUniverseName(parentUniverseData, universeData)
          universeData.isWinningUniverse = parentUniverseData.winningChildUniverseId === universeData.universe
          if (universeData.universe === currentUniverseData.id) {
            acc.currentLevel = [universeData].concat(acc.currentLevel)
          } else {
            acc.currentLevel.push(universeData)
          }
        } else {
          universeData.description = getUniverseName(grandParentUniverseData, universeData)
          universeData.isWinningUniverse = grandParentUniverseData.winningChildUniverseId === universeData.universe
          acc.parent = universeData
        }
        return acc
      }, initialMapping))
    },
  )
}

function getUniverseName(parentUniverseData, universeData) {
  if (!parentUniverseData.market) return 'GENESIS'

  if (universeData.isInvalid) return 'Invalid'

  const outcomeId = calculatePayoutNumeratorsValue(parentUniverseData.market, universeData.payout, universeData.isInvalid).toString()
  if (parentUniverseData.market.marketType === SCALAR) {
    return outcomeId
  }

  const outcome = parentUniverseData.reportableOutcomes.find(outcome => outcome.id === outcomeId)
  return outcome ? outcome.name : 'Unidentified'
}
