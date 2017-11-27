import { augur } from 'services/augurjs'

export function listenToUpdates() {
  return (dispatch, getState) => {
    augur.events.startBlockListeners({
      onAdded: (block) => {
        console.log('block added:', block)
        // dispatch(syncBlockchain())
        // dispatch(updateAssets())
        // dispatch(syncUniverse())
      },
      onRemoved: (block) => {
        console.log('block removed:', block)
        // dispatch(syncBlockchain())
        // dispatch(updateAssets())
        // dispatch(syncUniverse())
      }
    })
    augur.events.startAugurNodeEventListeners({
      MarketCreated: (err, log) => {
        if (err) return console.error('MarketCreated:', err)
        if (log) {
          console.log('MarketCreated:', log)
          // dispatch(loadMarketsInfo([log.marketID]))
          // if (log.sender === getState().loginAccount.address) {
          //   dispatch(updateAssets())
          //   dispatch(convertLogsToTransactions(TYPES.CREATE_MARKET, [log]))
          // }
        }
      },
      TokensTransferred: (err, log) => {
        if (err) return console.error('TokensTransferred:', err)
        if (log) {
          console.log('TokensTransferred:', log)
          // const { address } = getState().loginAccount
          // if (log._from === address || log._to === address) {
          //   dispatch(updateAssets())
          //   dispatch(convertLogsToTransactions(TYPES.TRANSFER, [log]))
          // }
        }
      },
      OrderCanceled: (err, log) => {
        if (err) return console.error('OrderCanceled:', err)
        if (log) {
          console.log('OrderCanceled:', log)
          // // if this is the user's order, then add it to the transaction display
          // if (log.sender === getState().loginAccount.address) {
          //   dispatch(updateAccountCancelsData({
          //     [log.market]: { [log.outcome]: [log] }
          //   }))
          //   dispatch(updateAssets())
          // }
        }
      },
      OrderCreated: (err, log) => {
        if (err) return console.error('OrderCreated:', err)
        if (log) {
          console.log('OrderCreated:', log)
          // // if this is the user's order, then add it to the transaction display
          // if (log.sender === getState().loginAccount.address) {
          //   dispatch(updateAccountBidsAsksData({
          //     [log.market]: {
          //       [log.outcome]: [log]
          //     }
          //   }))
          //   dispatch(updateAssets())
          // }
        }
      },
      OrderFilled: (err, log) => {
        if (err) return console.error('OrderFilled:', err)
        if (log) {
          console.log('OrderFilled:', log)
          // dispatch(updateOutcomePrice(log.market, log.outcome, new BigNumber(log.price, 10)))
          // dispatch(updateMarketTopicPopularity(log.market, log.amount))
          // const { address } = getState().loginAccount
          // if (log.sender !== address) dispatch(fillOrder(log))
          // if (log.sender === address || log.owner === address) {
          //   dispatch(updateAccountTradesData({
          //     [log.market]: { [log.outcome]: [{
          //       ...log,
          //       maker: log.owner === address
          //     }] }
          //   }))
          //   dispatch(updateAssets())
          //   dispatch(loadMarketsInfo([log.market]))
          //   console.log('MSG -- ', log)
          // }
        }
      },
      TradingProceedsClaimed: (err, log) => {
        if (err) return console.error('TradingProceedsClaimed:', err)
        if (log) {
          console.log('TradingProceedsClaimed:', log)
          // if (log && log.sender === getState().loginAccount.address) {
          //   dispatch(updateAssets())
          //   dispatch(convertLogsToTransactions(TYPES.PAYOUT, [log]))
          // }
        }
      },
      DesignatedReportSubmitted: (err, log) => {
        if (err) return console.error('DesignatedReportSubmitted:', err)
        if (log) {
          console.log('DesignatedReportSubmitted:', log)
        }
      },
      ReportSubmitted: (err, log) => {
        if (err) return console.error('ReportSubmitted:', err)
        if (log) {
          console.log('ReportSubmitted:', log)
          // if (log && log.sender === getState().loginAccount.address) {
          //   dispatch(updateAssets())
          //   dispatch(convertLogsToTransactions(TYPES.SUBMIT_REPORT, [log]))
          // }
        }
      },
      WinningTokensRedeemed: (err, log) => {
        if (err) return console.error('WinningTokensRedeemed:', err)
        if (log) {
          console.log('WinningTokensRedeemed:', log)
          // if (log && log.reporter === getState().loginAccount.address) {
          //   dispatch(updateAssets())
          //   dispatch(convertLogsToTransactions(TYPES.REDEEM_WINNING_TOKENS, [log]))
          // }
        }
      },
      ReportsDisputed: (err, log) => {
        if (err) return console.error('ReportsDisputed:', err)
        if (log) {
          console.log('ReportsDisputed:', log)
        }
      },
      MarketFinalized: (err, log) => {
        if (err) return console.error('MarketFinalized:', err)
        if (log) {
          console.log('MarketFinalized:', log)
          // const { universe, loginAccount } = getState()
          // if (universe.id === log.universe) {
          //   dispatch(loadMarketsInfo([log.market], () => {
          //     const { volume } = getState().marketsData[log.market]
          //     dispatch(updateMarketTopicPopularity(log.market, new BigNumber(volume, 10).neg().toNumber()))
          //     if (loginAccount.address) dispatch(claimProceeds())
          //   }))
          // }
        }
      },
      UniverseForked: (err, log) => {
        if (err) return console.error('UniverseForked:', err)
        if (log) {
          console.log('UniverseForked:', log)
        }
      },
    }, err => console.log(err || 'Listening for events'))
  }
}
