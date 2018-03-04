import speedomatic from 'speedomatic'
import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

export const collectMarketCreatorFees = (marketId, callback = logError) => (dispatch, getState) => {
  augur.api.Market.getMarketCreatorMailbox({ tx: { to: marketId } }, (err, marketMailboxAddress) => {
    if (err) return callback(err)
    if (marketMailboxAddress == null) return callback(`no market mailbox address found for market ${marketId}`)
    augur.api.Cash.getBalance({ _address: marketMailboxAddress }, (err, cashBalance) => {
      if (err) return callback(err)
      if (cashBalance == null) return callback('Cash.getBalance request failed')
      const bnCashBalance = speedomatic.bignum(cashBalance)
      augur.rpc.eth.getBalance([marketMailboxAddress, 'latest'], (err, attoEthBalance) => {
        if (err) return callback(err)
        const bnAttoEthBalance = speedomatic.bignum(attoEthBalance)
        const combined = speedomatic.unfix(bnAttoEthBalance.add(bnCashBalance), 'string')
        if (combined > 0) {
          augur.api.Mailbox.withdrawEther({ tx: { to: marketMailboxAddress } }, logError) // TODO should be sendTransaction?
          dispatch(loadMarketsInfo([marketId])) // TODO should loadMarketsInfo be called after withdrawEther finishes?
        }
        // TODO should callback be called after sending withdrawEther?
        callback(null, combined)
      })
    })
  })
}
