import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import logError from 'utils/log-error'

import { selectReportableOutcomes } from 'modules/reports/selectors/reportable-outcomes'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'

export default function (callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount, marketsData } = getState()
    const universeId = universe.id || UNIVERSE_ID

    const universeData = {
      market: "", // XXX
      payout: [], // XXX
      isInvalid: false, //XXX
      id: universeId,
      reportableOutcomes: null,
      winningChildUniverseId: null,
    }

    if (universe.isForking) {
      const forkingMarket = marketsData[universe.forkingMarket]
      universeData.reportableOutcomes = selectReportableOutcomes(forkingMarket.marketType, forkingMarket.outcomes)
      universeData.winningChildUniverseId = universe.winningChild
    }

    augur.api.Universe.getParentUniverse({ tx: { to: universeId } }, (err, parentUniverseId) => {
      if (err) return callback(err)

      if (parentUniverseId === '0x0000000000000000000000000000000000000000') {
        return getUniversesInfoWithParentContext(loginAccount.address, universeData, {id: parentUniverseId}, {id: parentUniverseId}, callback)
      }

      getUniverseInfo(parentUniverseId, (err, parentUniverseData) => {
        if (err) return callback(err)

        augur.api.Universe.getParentUniverse({ tx: { to: parentUniverseData.id } }, (err, grandParentUniverseId) => {
          if (err) return callback(err)
    
          if (grandParentUniverseId === '0x0000000000000000000000000000000000000000') {
            return getUniversesInfoWithParentContext(loginAccount.address, universeData, parentUniverseData, {id: grandParentUniverseId}, callback)
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
    market: "", // XXX
    payout: [], // XXX
    isInvalid: false, //XXX
  }

  augur.api.Universe.getForkingMarket({ tx: { to: universeId } }, (err, forkingMarket) => {
    if (err) return callback(err)
    augur.markets.getMarketsInfo({ marketIds: [forkingMarket] }, (err, marketsDataArray) => {
      if (err) return callback(err)
      universeData.reportableOutcomes = selectReportableOutcomes(marketsDataArray[0].marketType, marketsDataArray[0].outcomes)
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

function getUniversesInfoWithParentContext(account, universeData, parentUniverseData, grandParentUniverseData, callback) {
  augur.augurNode.submitRequest(
    'getUniversesInfo',
    {
      universe: universeData.id,
      account,
    }, (err, result) => {
      if (err) return callback(err)
      const initialMapping = {
        parent: null,
        children: [],
        currentLevel: [],
      }
      callback(result.reduce((acc, universeData) => {
        if (universeData.parentUniverse === universeData.id) {
          universeData.description = getUniverseName(universeData)
          universeData.isWinningUniverse = universe.winningChild === universeData.universe
          acc.children.push(universeData)
        } else if (universeData.parentUniverse === parentUniverseData.id) {
          universeData.description = getUniverseName(universeData)
          universeData.isWinningUniverse = parentUniverseData.winningChildUniverseId === universeData.universe
          if (universeData.universe === universeData.id) {
            acc.currentLevel = [universeData].concat(acc.currentLevel)
          } else {
            acc.currentLevel.push(universeData)
          }
        } else {
          universeData.description = getUniverseName(universeData)
          universeData.isWinningUniverse = grandParentUniverseData.winningChildUniverseId === universeData.universe
          acc.parent = universeData
        }
        return acc
      }, initialMapping))
    },
  )
}

function getUniverseName(universeData) {
  const outcomeId = calculatePayoutNumeratorsValue(universeData.market, universeData.payout, universeData.isInvalid).toString()
  if (marketType === SCALAR) {
    return outcomeId
  }

  const outcome = universeData.reportableOutcomes.find(outcome => outcome.id === outcomeId)
  return outcome ? outcome.name : "???"
}
