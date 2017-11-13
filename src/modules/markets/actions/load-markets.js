import { augur } from 'services/augurjs'
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets'
import { clearMarketsData, updateMarketsData } from 'modules/markets/actions/update-markets-data'
import isObject from 'utils/is-object'
import logError from 'utils/log-error'

const loadMarkets = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  // NOTE: this call has been changed to work with AugurNode and use the getMarkets function to return an array of marketIDs
  augur.augurNode.submitRequest('getMarkets', { universe: universe.id }, (err, marketsArray) => {
    if (err) return callback(err)
    // NOTE: added for AugurNode Stuff: this takes the array of market IDs and returns an array of Market Objects
    augur.markets.getMarketsInfo({ universe: universe.id, marketIDs: marketsArray }, (err, marketsDataArray) => {
      if (err) return callback(err)
      // NOTE: added for AugurNode Stuff: Creates a MarketsData object by looping through the array of market Objects and placing them into the MarketsData object as key/value pairs using the markets ID as a key.
      const marketsData = {}
      marketsDataArray.forEach((marketData, index) => {
        marketsData[marketData.id] = marketData
      })
      // NOTE: finally do what was normally here prior to augurNode changes:
      if (marketsData == null || !isObject(marketsData)) {
        dispatch(updateHasLoadedMarkets(false))
        return callback(`no markets data received`)
      }
      if (!Object.keys(marketsData).length) return callback(null)
      dispatch(clearMarketsData())
      dispatch(updateMarketsData(marketsData))
      dispatch(updateHasLoadedMarkets(true))
      callback(null, marketsData)
    })
  })
}

export default loadMarkets
