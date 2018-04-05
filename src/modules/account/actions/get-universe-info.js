import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import logError from 'utils/log-error'
import noop from 'utils/noop'

export default function (callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    const universeId = universe.id || UNIVERSE_ID

    // If parent universe get forking market, see if finalized, and if so get winning child universe. See sync universe

    augur.api.Universe.getParentUniverse({ tx: { to: universeId }}, (err, parentUniverseId) => {
      if (err) return callback(err)

      if (parentUniverseId === '0x0000000000000000000000000000000000000000') {
        return getUniversesInfoWithParentContext(loginAccount.address, universeId, parentUniverseId, null, callback)
      }
      augur.api.Universe.getForkingMarket({ tx: { to: parentUniverseId }}, (err, forkingMarket) => {
        if (err) return callback(err)
        augur.api.Market.isFinalized({ tx: { to: forkingMarket } }, (err, isForkingMarketFinalized) => {
          if (err) return next(err)
          if (!isForkingMarketFinalized) {
            return getUniversesInfoWithParentContext(loginAccount.address, universeId, parentUniverseId, null, callback)
          } else {
            augur.api.Universe.getWinningChildUniverse(universePayload, (err, winningChildUniverse) => {
              if (err) return callback(err)
              return getUniversesInfoWithParentContext(loginAccount.address, universeId, parentUniverseId, winningChildUniverse, callback)
            })
          }
        })
      })
    })
  }
}

function getUniversesInfoWithParentContext(account, universeId, parentUniverseId, winningChildOfParent, callback) {
  augur.augurNode.submitRequest(
    'getUniversesInfo',
    {
      universe: universeId,
      account,
    }, (err, result) => {
      if (err) return callback(err)
      const initialMapping = {
        parent: null,
        children: [],
        currentLevel: [],
      }
      callback(result.reduce((acc, universeData) => {
        if (universeData.parentUniverse === universeId) {
          acc.children.push(universeData);
        } else if (universeData.parentUniverse === parentUniverseId) {
          universeData.isWinningUniverse = winningChildOfParent === universeData.universe
          acc.currentLevel.push(universeData);
        }
        else {
          acc.parent = universeData;
        }
        return acc
      }, initialMapping))
    },
  )
} 