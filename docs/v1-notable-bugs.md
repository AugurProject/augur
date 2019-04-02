# V1 Bugs (Fixed in V2)

## Floating bond amounts can reset

The way the floating bond values are calculated in v1 they depend on the last window having a value and the current window having some number of markets that resolved. If either of these are not the case the bond just resets to the base value. This results in bonds dropping to the lowest amount even if they’ve been increasing for a very long time steadily.

## Adding rep to initial reporter increases initial report size

The initial reporter contract holds the REP used in the initial report bond for a market. The contracts naively calculated the initial report size based on the REP balance of this contract at the time of the actual report. This means that any REP sent to the contract before the report will be included in the initial report size. This could be used to make the very first dispute size extremely large, including potentially so large it can’t be raised (if 33.3% of REP was placed).

## Reporting fee units off by 10**18

The reporting fee in Augur is calculated and adjusted by comparing the OI within the platform to a target OI which is based on the price of REP. The goal of this is to dynamically adjust the fee rate downward when the price is too speculative and upward when the price does not reflect the fees being collected.
There is an error in the current contracts however which will prevent the fee from ever rising. Namely the getRepMarketCapInAttoeth function does not properly convert units and will always be many orders of magnitude too high when comparing to the target market cap.

While this is a very serious problem for the platform long term the intention is to release a v2 of the contracts within a relatively short time frame and since the price of REP is still highly speculative relative to OI this will almost certainly not become a problem.

## Orderbook has bugs in the linked list implementation resulting in orphaned orders

The structure and logic for the on chain orderbook is spread throughout multiple contracts and is somewhat complex. While generally working correctly there are few known contract logic errors which can cause the orderbook to end up in a broken state.

The first is in the OrdersFetcher contract within the descendOrderList function. Note that if it finds an order of equal price it stops traversing. This is incorrect behavior since a new order of the same price should be considered worse than all orders of that price rather than just the first found. The result is incorrectly ordered orders of the same price, which while not technically correct is a minor issue.

The second ordering bug is found in the Orders contract in the updateWorstBidOrder and updateWorstAskOrder functions. Both of these will only update the respective best and worst orders when they are strictly worse price wise. A new order of the same price however should actually become the new worse order. The result of this bug is that the linked list can become broken and orders may end up being hidden in the orderbook. Steps within the UI have already been implemented to help order creators when this occurs rarely.

## REP Transfer Before forkAndRedeem() Allows Stakers to Arbitrarily Increase 50% Bonus Stake

Any REP staked in a ReportingParticipant in a forking market gets a 50% bonus in newREP when redeemed in its respective child universe.
Users can arbitrarily transfer REP to any ReportingParticipant before forkAndRedeem() is called to increase the amount of REP eligible for bonus.
This allows users who have a >50% stake (this requirement can be lessened if stake owners collaborate and pool funds) to arbitrarily increase their bonus-eligible stake before fork() is invoked.
