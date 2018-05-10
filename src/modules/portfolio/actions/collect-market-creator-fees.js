import speedomatic from 'speedomatic'
import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { loadUnclaimedFees } from 'modules/markets/actions/load-unclaimed-fees'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

export const collectMarketCreatorFees = (getBalanceOnly, marketId, callback = logError) => (dispatch, getState) => {
  augur.api.Market.getMarketCreatorMailbox({ tx: { to: marketId } }, (err, marketMailboxAddress) => {
    if (err) return callback(err)
    if (marketMailboxAddress == null) return callback(`no market mailbox address found for market ${marketId}`)
    augur.api.Cash.balanceOf({ _owner: marketMailboxAddress }, (err, cashBalance) => {
      if (err) return callback(err)
      if (cashBalance == null) return callback('Cash.balanceOf request failed')
      const bnCashBalance = speedomatic.bignum(cashBalance)
      augur.rpc.eth.getBalance([marketMailboxAddress, 'latest'], (err, attoEthBalance) => {
        if (err) return callback(err)
        const bnAttoEthBalance = speedomatic.bignum(attoEthBalance)
        const combined = speedomatic.unfix(bnAttoEthBalance.plus(bnCashBalance), 'string')
        if (getBalanceOnly) {
          return callback(null, combined)
        }
        if (combined > 0) {
          // something to collect? sendTransaction to withdrawEther
          augur.api.Mailbox.withdrawEther({
            tx: { to: marketMailboxAddress },
            onSent: noop,
            onSuccess: (res) => {
              dispatch(loadMarketsInfo([marketId]))
              dispatch(loadUnclaimedFees([marketId]))
              callback(null, combined)
            },
            onFailed: err => callback(err),
          })
        } else {
          // else callback to let the callback know there is 0 to collect.
          callback(null, combined)
        }
      })
    })
  })
}
