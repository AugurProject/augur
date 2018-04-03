import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import logError from 'utils/log-error'
import noop from 'utils/noop'

export default function (callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    const universeId = universe.id || UNIVERSE_ID

    const parentUniverseId = '0x0000000000000000000000000000000000000000'; // XXX todo Should be requested

    augur.augurNode.submitRequest(
      'getUniversesInfo',
      {
        universe: universeId,
        account: loginAccount.address,
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
}
