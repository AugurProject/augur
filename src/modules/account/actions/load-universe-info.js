import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import logError from 'utils/log-error'
import async from 'async'
import { createBigNumber } from 'utils/create-big-number'
import { updateUniverse } from 'modules/universe/actions/update-universe'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'
import { selectReportableOutcomes } from 'modules/reports/selectors/reportable-outcomes'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'
import { SCALAR } from 'modules/markets/constants/market-types'
import { NULL_ADDRESS } from 'utils/constants'

export function loadUniverseInfo(callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount, marketsData } = getState()
    const universeId = universe.id || UNIVERSE_ID

    const universeData = {
      market: null,
      id: universeId,
      reportableOutcomes: null,
      winningChildUniverseId: null,
      openInterest: universe.openInterest || '0',
    }

    if (universe.isForking) {
      const forkingMarket = marketsData[universe.forkingMarket]
      universeData.market = forkingMarket
      universeData.reportableOutcomes = selectReportableOutcomes(forkingMarket.marketType, forkingMarket.outcomes)
      universeData.winningChildUniverseId = universe.winningChildUniverse
    }

    augur.api.Universe.getParentUniverse({ tx: { to: universeId } }, (err, parentUniverseId) => {
      if (err) return callback(err)

      if (parentUniverseId === NULL_ADDRESS) {
        return getUniversesInfoWithParentContext(loginAccount.address, universeData, { id: parentUniverseId }, { id: parentUniverseId }, callback)
      }

      getUniverseInfo(parentUniverseId, (err, parentUniverseData) => {
        if (err) return callback(err)

        augur.api.Universe.getParentUniverse({ tx: { to: parentUniverseData.id } }, (err, grandParentUniverseId) => {
          if (err) return callback(err)

          if (grandParentUniverseId === NULL_ADDRESS) {
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
    openInterest: '0',
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

      async.forEachOf(result, (obj, key, callback) => {
        augur.api.Universe.getOpenInterestInAttoEth({ tx: { to: obj.universe } }, (err, openInterest) => {
          // give default value of 0, there might have been error
          obj.openInterest = openInterest || 0
          callback(err, obj)
        })
      }, (err) => {
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
      })
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

  const outcome = parentUniverseData.reportableOutcomes[outcomeId]
  const outComeLabel = outcome && (outcome.description || outcome.name)
  return outComeLabel || 'Unidentified'
}


export function getForkingInfo(universe, callback) {
  return (dispatch, getState) => {
    const universePayload = { tx: { to: universe.id } }
    // Getting current fork data
    augur.api.Universe.getForkingMarket(universePayload, (err, forkingMarket) => {
      if (err) return callback(err)
      const isForking = forkingMarket !== '0x0000000000000000000000000000000000000000'
      if (isForking) {
        dispatch(loadMarketsInfoIfNotLoaded([forkingMarket]))
        async.parallel({
          forkEndTime: (next) => {
            augur.api.Universe.getForkEndTime(universePayload, (err, forkEndTime) => {
              if (err) return next(err)
              next(null, forkEndTime)
            })
          },
          isForkingMarketFinalized: (next) => {
            augur.api.Market.isFinalized({ tx: { to: forkingMarket } }, (err, isForkingMarketFinalized) => {
              if (err) return next(err)
              next(null, isForkingMarketFinalized)
            })
          },
          forkReputationGoal: (next) => {
            augur.api.Universe.getForkReputationGoal(universePayload, (err, forkReputationGoal) => {
              if (err) return next(err)
              next(null, forkReputationGoal)
            })
          },
        }, (err, universeData) => {
          if (err) return callback(err)
          if (universeData.isForkingMarketFinalized) {
            augur.api.Universe.getWinningChildUniverse(universePayload, (err, winningChildUniverse) => {
              if (err) return callback(err)
              updateUniverseIfForkingDataChanged(dispatch, universe, {
                ...universeData,
                forkingMarket,
                winningChildUniverse,
                isForking,
              })
            })
          } else {
            updateUniverseIfForkingDataChanged(dispatch, universe, { ...universeData, forkingMarket, isForking, winningChildUniverse: undefined })
          }
        })
      } else {
        updateUniverseIfForkingDataChanged(dispatch, universe, { isForking, forkingMarket, forkEndTime: undefined, isForkingMarketFinalized: undefined, winningChildUniverse: undefined })
      }
    })
  }
}

function updateUniverseIfForkingDataChanged(dispatch, oldUniverseData, universeData) {
  if (
    oldUniverseData.id !== universeData.id ||
    oldUniverseData.isForking !== universeData.isForking ||
    oldUniverseData.forkingMarket !== universeData.forkingMarket ||
    oldUniverseData.forkEndTime !== universeData.forkEndTime ||
    oldUniverseData.isForkingMarketFinalized !== universeData.isForkingMarketFinalized ||
    oldUniverseData.winningChildUniverse !== universeData.winningChildUniverse
  ) {
    dispatch(updateUniverse(universeData))
  }
}

export function getUniverseProperties(universe, callback) {
  return (dispatch, getState) => {
    const universePayload = { tx: { to: universe.id } }

    async.parallel({
      forkThreshold: (next) => {
        augur.api.Universe.getDisputeThresholdForFork(universePayload, (err, disputeThresholdForFork) => {
          if (err) return callback(err)
          const forkThreshold = createBigNumber(disputeThresholdForFork, 10)
          if (forkThreshold !== universe.forkThreshold) {
            next(null, forkThreshold)
          }
        })
      },
      openInterest: (next) => {
        augur.api.Universe.getOpenInterestInAttoEth(universePayload, (err, openInterest) => {
          if (err) return next(err)
          next(null, openInterest)
        })
      },
    }, (err, universeData) => {
      dispatch(updateUniverse(universeData))
    })
  }
}
