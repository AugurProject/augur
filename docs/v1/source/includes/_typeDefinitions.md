API Type Definitions
================

augur.js' functions accept and return a variety of different objects, which are described below.

<a name="AccountTransfer"></a>
### AccountTransfer  (Object)

#### **Properties:** 
* **`transactionHash`** (string) Hash returned by token transfer.
* **`logIndex`** (number) Number of the log index position in the Ethereum block containing the transfer.
* **`creationBlockNumber`** (number) Number of the Ethereum block containing the transfer.
* **`blockHash`** (string) Hash of the Ethereum block containing the transfer.
* **`creationTime`** (number) Timestamp, in seconds, when the Ethereum block containing the transfer was created.
* **`sender`** (string|null) Ethereum address of the token sender. If null, this indicates that new tokens were minted and sent to the user.
* **`recipient`** (string|null) Ethereum address of the token recipient. If null, this indicates that tokens were burned (i.e., destroyed).
* **`token`** (string) Contract address of the contract for the sent token, as a hexadecimal string.
* **`value`** (string) Quantity of tokens sent.
* **`symbol`** (string|null) Token symbol (if any).
* **`marketId`** (string|null) Contract address of the Market in which the tranfer took place, as a hexadecimal string (if any).
* **`outcome`** (number|null) Market Outcome with which the token is associated (if any).
* **`isInternalTransfer`** (boolean) Whether the transfer was a trade/order transaction.

<a name="AggregatedTradingPosition"></a>
### AggregatedTradingPosition  (Object)

#### **Properties:** 
* **`realized`** (string) Profit a user made for total historical positions which have _since been closed_ in a market outcome (i.e., `realized` is accrued profit for Shares a user previously owned).
* **`unrealized`** (string) Percent profit a user would have on just their current `netPosition` if they were to close it at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome.
* **`total`** (string) `unrealized` plus `realized` (i.e., is the profit a user made on previously owned Shares in a Market Outcome, plus what they could make if they closed their current `netPosition` in that Outcome).
* **`unrealizedCost`** (string) Amount of ETH a user paid to open their current
net position in that Market Outcome. This is a cashflow amount that the user remitted based on Share price not trade price. For example, if a user opens a short position for one Share in a YesNo Market at a trade price of 0.2, then the unrealized cost is `MarketMaxPrice=1.0 - TradePrice=0.2 --> SharePrice=0.8 * 1 share --> UnrealizedCost=0.8`. In Categorical Markets, the user may pay Shares of other Outcomes in lieu of ETH, which doesn't change the calculation for `unrealizedCost`, but it does mean that (in a Categorical Market) `unrealizedCost` may be greater than the actual ETH a user remitted.
* **`realizedCost`** (string) Amount of ETH a user paid for the total historical cost to open all positions which have _since been closed_ for that Market Outcome. (ie., `realizedCost` is accrued cost for Shares a user previously owned). `realizedCost` is a cashflow amount that the user remitted based on Share price not trade price).
* **`totalCost`** (string) `unrealizedCost` plus `realizedCost` (i.e., `totalCost` is the cashflow amount the user remitted, based on Share price not trade price, for all shares they ever bought in this Market Outcome).
* **`realizedPercent`** (string) Percent profit a user made for total historical positions which have _since been closed_ in a market outcome (i.e., `realizedPercent` is accrued profit percent for Shares a user previously owned). `realizedPercent` is `realized` divided by `realizedCost`.
* **`unrealizedPercent`** (string) Percent profit a user would have on just their current `netPosition` if they were to close it at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome. `unrealizedPercent` is `Unrealized` divided by `unrealizedCost`.
* **`totalPercent`** (string) `total` divided by `totalCost` (i.e., `totalPercent` is the total/final percent profit a user would make if they closed their `netPosition` at the last price). In other words, TotalProfitPercent is what `realizedPercent` _would become_ if the user closed their `netPosition` at the last price.
* **`unrealizedRevenue`** (string) amount of ETH a user would receive for their current `netPosition` if they were to close that position at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome. For example if a user has a long position of 10 Shares in a YesNo market, and the last price is 0.75, then `NetPosition=10 * LastPrice=0.75 --> UnrealizedRevenue=7.5`.
* **`unrealizedRevenue24hAgo`** (string) Same as `unrealizedRevenue`, but calculated using the last trade price from 24 hours ago, as if the user held this position constant for the past 24 hours. But, if the user (further) opened their current position within the past 24 hours, then the price at which the position was opened is used instead of the actual last trade price from 24 hours ago.
* **`unrealizedRevenue24hChangePercent`** (string) Percent change in `unrealizedRevenue` from 24 hours ago.
* **`frozenFunds`** (string) ETH that a user has given up (locked in escrow or given to a counterparty) to obtain their current position.

<a name="AugurEventLog"></a>
### AugurEventLog  (Object)

Note: Other properties will be present in this object, depending on what event type it is. For a list of which values are logged for which events, refer to the [Event Types](#event-types) section.

#### **Properties:** 
* **`address`**  (string) The 20-byte Ethereum contract address of the contract that emitted this event log.
* **`removed`**  (boolean) Whether the transaction this event was created from was removed from the Ethereum blockchain (due to an orphaned block) or never gotten to (due to a rejected transaction).
* **`transactionHash`**  (string) Hash of the transactions this log was created from, as a 32-byte hexadecimal value.
* **`transactionIndex`**  (number) Integer of the transaction's index position in the block.
* **`logIndex`**  (number) Integer of the log index position in the block.
* **`blockNumber`**  (number) Number of the block on the Ethereum blockchain where the event was logged.
* **`blockHash`** (string) Hash of the block on the Ethereum blockchain where the event was logged, as a 32-byte hexadecimal value.
* **`contractName`**  (string) Name of the Solidity contract in which the event is defined.
* **`eventName`**  (string) Name of the event type being logged.

<a name="BetterWorseOrders"></a>
### BetterWorseOrders  (Object)

#### **Properties:** 
* **`betterOrderId`** (string|null) ID of the order with the next best price over the specified order ID, as a hexadecimal string.
* **`worseOrderId`** (string|null) ID of the order with the next worse price over the specified order ID, as a hexadecimal string.

<a name="Category"></a>
### Category  (Object)

#### **Properties:** 
* **`category`** (string) Name of the Category.
* **`nonFinalizedOpenInterest`** (string) Sum of Open Interest in non-Finalized Markets in this aggregation, in ETH.
* **`openInterest`** (string) Sum of Open Interest in all Markets in this aggregation, in ETH.
* **`tags`** (Array.&lt;<a href="#Tag">Tag</a>>) Array containing information about Markets with [Tags](#Tag) in this Category.

<a name="ClaimReportingFeesForkedMarket"></a>
### ClaimReportingFeesForkedMarket  (Object)

* **`crowdsourcers`** (Array.&lt;<a href="#CrowdsourcerState">CrowdsourcerState</a>>) Array of objects containing information about the Forked Market's DisputeCrowdsourcer contracts.
* **`initialReporter`** (<a href="#InitialReporterState">InitialReporterState</a>|null) Object containing information about the Forked Market's InitialReporter contract.

<a name="ClaimReportingFeesForkedMarketGasEstimates"></a>
### ClaimReportingFeesForkedMarketGasEstimates  (Object)

#### **Properties:** 
* **`crowdsourcerForkAndRedeem`** (Array.&lt;<a href="#GasEstimateInfo">GasEstimateInfo</a>>) Array of GasEstimateInfo objects containing gas estimates for each `DisputeCrowdsourcer.forkAndRedeem` call.
* **`initialReporterForkAndRedeem`** (Array.&lt;<a href="#GasEstimateInfo">GasEstimateInfo</a>>)  Array of GasEstimateInfo objects containing gas estimates for each `InitialReporter.forkAndRedeem` call.
* **`crowdsourcerRedeem`** (Array.&lt;<a href="#GasEstimateInfo">GasEstimateInfo</a>>)  Array of GasEstimateInfo objects containing gas estimates for each `DisputeCrowdsourcer.redeem` call.
* **`initialReporterRedeem`** (Array.&lt;<a href="#GasEstimateInfo">GasEstimateInfo</a>>)  Array of GasEstimateInfo objects containing gas estimates for each `InitialReporter.redeem` call.
* **`totals`** (<a href="#GasEstimatesForkedMarketTotals">GasEstimatesForkedMarketTotals</a>) Object containing gas estimate sums for each type of function call.

<a name="ClaimReportingFeesForkedMarketResponse"></a>
### ClaimReportingFeesForkedMarketResponse  (Object)

#### **Properties:** 
* **`successfulTransactions`** (<a href="#SuccessfulTransactionsForkedMarket">SuccessfulTransactionsForkedMarket</a>|null) Object containing arrays of contract addresses whose transactions succeeded. Not set if `p.estimateGas` is true.
* **`failedTransactions`** (<a href="#FailedTransactionsForkedMarket">FailedTransactionsForkedMarket</a>|null) Object containing arrays of contract addresses whose transactions failed. Not set if `p.estimateGas` is true.
* **`gasEstimates`** (<a href="#ClaimReportingFeesForkedMarketGasEstimates">ClaimReportingFeesForkedMarketGasEstimates</a>|null) Object containing a breakdown of gas estimates for all reporting fee claim transactions. Not set if `p.estimateGas` is false.

<a name="ClaimReportingFeesNonforkedMarket"></a>
### ClaimReportingFeesNonforkedMarket  (Object)

* **`marketId`** (string) Ethereum contract address of the non-Forked Market, as a hexadecimal string.
* **`crowdsourcersAreDisavowed`** (boolean) Whether the non-Forked Market's DisputeCrowdsourcers have been disavowed (i.e., its `Market.disavowCrowdsourcers` function has been called successfully).
* **`isMigrated`** (boolean) Whether the non-Forked Market has been migrated to the Child Universe of its original Universe (i.e., its `Market.migrateThroughOneFork` function has been called successfully).
* **`isFinalized`** (boolean) Whether the non-Forked Market has been Finalized (i.e., its `Market.finalize` function has been called successfully).
* **`crowdsourcers`** (Array.&lt;string>) Array of Ethereum contract addresses of the non-Forked Market's Crowdsourcers in which a specified user has unclaimed Reporting Fees, as hexadecimal strings.
* **`initialReporter`** (string|null) Ethereum contract address of the non-Forked Market's InitialReporter in which a specified user has unclaimed Reporting Fees, as a hexadecimal string.

<a name="ClaimReportingFeesNonforkedMarketsGasEstimates"></a>
### ClaimReportingFeesNonforkedMarketsGasEstimates  (Object)

#### **Properties:** 
* **`disavowCrowdsourcers`** (Array.&lt;<a href="#GasEstimateInfo">GasEstimateInfo</a>>) Array of GasEstimateInfo objects containing gas estimates for each `Market.disavowCrowdsourcers` call.
* **`feeWindowRedeem`** (Array.&lt;<a href="#GasEstimateInfo">GasEstimateInfo</a>>) Array of GasEstimateInfo objects containing gas estimates for each `FeeWindow.redeem` call.
* **`crowdsourcerRedeem`** (Array.&lt;<a href="#GasEstimateInfo">GasEstimateInfo</a>>) Array of GasEstimateInfo objects containing gas estimates for each `DisputeCrowdsourcer.redeem` call.
* **`initialReporterRedeem`** (Array.&lt;<a href="#GasEstimateInfo">GasEstimateInfo</a>>) Array of GasEstimateInfo objects containing gas estimates for each `InitialReporter.redeem` call.
* **`totals`** (<a href="#GasEstimatesNonforkedMarketsTotals">GasEstimatesNonforkedMarketsTotals</a>) Object containing gas estimate sums for each type of function call.

<a name="ClaimReportingFeesNonforkedMarketsResponse"></a>
### ClaimReportingFeesNonforkedMarketsResponse  (Object)

#### **Properties:** 
* **`successfulTransactions`** (<a href="#SuccessfulTransactionsNonforkedMarkets">SuccessfulTransactionsNonforkedMarkets</a>|null) Object containing arrays of which transactions succeeded. Not set if `p.estimateGas` is true.
* **`failedTransactions`** (<a href="#FailedTransactionsNonforkedMarkets">FailedTransactionsNonforkedMarkets</a>|null) Object containing arrays of which transactions failed. Not set if `p.estimateGas` is true.
* **`gasEstimates`** (<a href="#ClaimReportingFeesNonforkedMarketsGasEstimates">ClaimReportingFeesNonforkedMarketsGasEstimates</a>|null) Object containing a breakdown of gas estimates for all reporting fee redemption transactions. Not set if `p.estimateGas` is false.

<a name="ConnectOptions"></a>
### ConnectOptions  (Object)

#### **Properties:** 
* **`ethereumNode`** (<a href="#EthereumNode">EthereumNode</a>) Object containing information on how to connect to a desired Ethereum node, either locally or remotely (hosted).
* **`augurNode`** (string) &lt;optional> Websocket address of an [Augur Node](#augur-node).

<a name="CrowdsourcerState"></a>
### CrowdsourcerState  (Object)

* **`crowdsourcerId`** (string) Ethereum contract address of a DisputeCrowdsourcer contract belonging to a Forked Market, as a hexadecimal string.
* **`needsFork`** (boolean) Whether the DisputeCrowdsourcer contract needs to have its `DisputeCrowdsourcer.fork` function called before calling `DisputeCrowdsourcer.redeem`.

<a name="DISPUTE_TOKEN_STATE"></a>
### DISPUTE_TOKEN_STATE  (Object)

Serves as an enum for the state of a Dispute Token.

#### **Properties:** 
* **`ALL`** (string) Dispute Token can be in any state. (If no Dispute Token state is specified, this is the default value.)
* **`UNCLAIMED`** (string) Dispute Token is in a Finalized Market, was staked on the correct Outcome, and has not been claimed yet.
* **`UNFINALIZED`** (string) Dispute Token is in a Market that has not been Finalized.

<a name="DisputeToken"></a>
### DisputeToken  (Object)

#### **Properties:** 
* **`disputeToken`** (string) Contract address of the Dispute Token, as a hexadecimal string.
* **`marketId`** (string) Ethereum address of the Market, as a hexadecimal string.
* **`payout0`** (number|null) Payout numerator 0 of the Dispute Token's payout set.
* **`payout1`** (number|null) Payout numerator 1 of the Dispute Token's payout set.
* **`payout2`** (number|null) Payout numerator 2 of the Dispute Token's payout set. (Set to null for Yes/No and Scalar Markets.)
* **`payout3`** (number|null) Payout numerator 3 of the Dispute Token's payout set. (Set to null for Yes/No and Scalar Markets.)
* **`payout4`** (number|null) Payout numerator 4 of the Dispute Token's payout set. (Set to null for Yes/No and Scalar Markets.)
* **`payout5`** (number|null) Payout numerator 5 of the Dispute Token's payout set. (Set to null for Yes/No and Scalar Markets.)
* **`payout6`** (number|null) Payout numerator 6 of the Dispute Token's payout set. (Set to null for Yes/No and Scalar Markets.)
* **`payout7`** (number|null) Payout numerator 7 of the Dispute Token's payout set. (Set to null for Yes/No and Scalar Markets.)
* **`isInvalid`** (boolean|number) Whether the Market was determined to be invalid.
* **`balance`** (string) Dispute Token balance the owner has staked, in ETH.
* **`winningToken`** (boolean|null) Index of the Payout Numerator that was determined to be the Market's Final Outcome.
* **`tentativeWinning`** (boolean) Index of the Payout Numerator that is tentatively the winning Outcome.
* **`claimed`** (boolean) Whether the Dispute Token has been claimed by the owner.
* **`reportingState`** (<a href="#REPORTING_STATE">REPORTING_STATE</a>) Reporting state of the Market.

<a name="EthereumNode"></a>
### EthereumNode  (Object)

#### **Properties:** 
* **`http`** (string|null) HTTP address of an Ethereum node.
* **`httpAddresses`** (Array.&lt;string>|null) Array of HTTP Ethereum node addresses. (Can be used instead of `http` to specify a list of HTTP addresses to iterate through until a connection is established.)
* **`ws`** (string|null) Websocket address of an Ethereum node.
* **`wsAddresses`** (Array.&lt;string>|null) Array of WebSocket Ethereum node addresses. (Can be used instead of `ws` to specify a list of WebSocket addresses to iterate through until a connection is established.)
* **`ipc`** (string|null) IPC address of an Ethereum node.
* **`ipcAddresses`** (Array.&lt;string>|null) Array of IPC Ethereum node addresses. (Can be used instead of `ipc` to specify a list of IPC addresses to iterate through until a connection is established.)
* **`networkId`** (string|null) Network ID of the current Ethereum node connection. For example, 1 for the Ethereum public main network, 3 for Ropsten (public cross-client Ethereum test network), 4 for Rinkeby (public Geth PoA test network), 42 for Kovan (public Parity PoA test network), etc.

<a name="ExtraInfo"></a>
### ExtraInfo  (Object)

#### **Properties:** 
* **`resolutionSource`** (string|null) Source that should be referenced when determining the Outcome of a Market.
* **`tags`** (Array.&lt;string>|null) Keywords used to tag the Market (maximum of 2).
* **`longDescription`** (string|null) Additional information not included in description of the Market.
* **`_scalarDenomination`** (string|null) Denomination used for describing the Outcome of a Scalar Market (e.g., degrees Fahrenheit, dollars, etc.) Not used when creating a Yes/No or Categorical Market.

<a name="FailedTransactionsForkedMarket"></a>
### FailedTransactionsForkedMarket  (Object)

#### **Properties:** 
* **`crowdsourcerForkAndRedeem`** (Array.&lt;string>) Array of DisputeCrowdsourcer contract addresses that had failed calls to `DisputeCrowdsourcer.forkAndRedeem`.
* **`initialReporterForkAndRedeem`** (Array.&lt;string>) Array of InitialReporter contract addresses that had failed calls to `InitialReporter.forkAndRedeem`.
* **`crowdsourcerRedeem`** (Array.&lt;string>) Array of DisputeCrowdsourcer contract addresses that had failed calls to `DisputeCrowdsourcer.redeem`.
* **`initialReporterRedeem`** (Array.&lt;string>) Array of InitialReporter contract addresses that had failed calls to `InitialReporter.redeem`.

<a name="FailedTransactionsNonforkedMarkets"></a>
### FailedTransactionsNonforkedMarkets  (Object)

#### **Properties:** 
* **`disavowCrowdsourcers`** (Array.&lt;string>) Array of Market contract addresses that had failed calls to `Market.disavowCrowdsourcers`.
* **`feeWindowRedeem`** (Array.&lt;string>) Array of FeeWindow contract addresses that had failed calls to `FeeWindow.redeem`.
* **`crowdsourcerRedeem`** (Array.&lt;string>) Array of DisputeCrowdsourcer contract addresses that had failed calls to `DisputeCrowdsourcer.redeem`.
* **`initialReporterRedeem`** (Array.&lt;string>) Array of InitialReporter contract addresses that had failed calls to `InitialReporter.redeem`.

<a name="FeeWindowCurrent"></a>
### FeeWindowCurrent  (Object)

#### **Properties:** 
* **`endTime`** (number) Unix timestamp for when the Fee Window begins.
* **`feeToken`** (string) Ethereum address of the [Fee Token](#fee-token) for the current Fee Window.
* **`feeWindow`** (string) Ethereum contract address of the Fee Window.
* **`feeWindowEthFees`** (string) Amount of Reporting Fees the current Fee Window contains in its Reporting Fee Pool, in attoETH.
* **`feeWindowFeeTokens`** (string) Number of Fee Tokens Staked in the current Fee Window.
* **`feeWindowId`** (number) Unique numerical ID of the Fee Window.
* **`feeWindowParticipationTokens`** (string) Number of [Participation Tokens](#participation-token) purchased by users in the current Fee Window.
* **`feeWindowRepStaked`** (string) Amount of REP Staked in all DisputeCrowdsourcer and InitialReporter contracts in the current Fee Window.
* **`participantContributions`** (string) &lt;optional> Total amount of attoREP `reporter` Staked in InitialReporter and DisputeCrowdsourcer contracts in the current Fee Window. Returned if `reporter` was specified.
* **`participantContributionsCrowdsourcer`** (string) &lt;optional> Amount of attoREP `reporter` Staked in DisputeCrowdsourcer contracts in the current Fee Window. Returned if `reporter` was specified.
* **`participantContributionsInitialReport`** (string) &lt;optional> Amount of attoREP `reporter` Staked in InitialReporter contracts in the current Fee Window. Returned if `reporter` was specified.
* **`participationTokens`** (string) &lt;optional> Amount of attoREP that `reporter` has put into Fee Tokens in the current Fee Window. This number is the same as `participantParticipationTokens`, but exists for legacy reasons. Returned if `reporter` was specified.
* **`participantParticipationTokens`** (string) &lt;optional> Amount of attoREP that `reporter` has put into Fee Tokens in the current Fee Window. Returned if `reporter` was specified.
* **`startTime`** (number) Unix timestamp for when the Fee Window begins.
* **`totalStake`** (string) &lt;optional> The total amount of attoREP `reporter` has Staked in the current Fee Window will be returned as `totalStake`. (This amount includes attoREP Staked on Initial Reports as well as on Dispute Crowdsourcers.) `participantContributions` and `participantTokens` should add up to `totalStake`. Returned if `reporter` was specified.
* **`universe`** (string) Ethereum contract address of the Universe to which the Fee Window belongs.

<a name="FrozenFunds"></a>
### FrozenFunds  (Object)

#### **Properties:** 
* **`frozenFunds`** (string) ETH that a user has given up (locked in escrow or given to a counterparty) to obtain their current position.

<a name="GasEstimateInfo"></a>
### GasEstimateInfo  (Object)

#### **Properties:** 
* **`address`** (string) Ethereum contract address to which `estimate` applies.
* **`estimate`** (string) Gas estimate for calling a particular function at `address`.

<a name="GasEstimatesForkedMarketTotals"></a>
### GasEstimatesForkedMarketTotals  (Object)

#### **Properties:** 
* **`crowdsourcerForkAndRedeem`** (string) Sum of gas estimates for all `DisputeCrowdsourcer.forkAndRedeem` calls.
* **`initialReporterForkAndRedeem`** (string) Sum of gas estimates for all `InitialReporter.forkAndRedeem` calls.
* **`crowdsourcerRedeem`** (string) Sum of gas estimates for all `DisputeCrowdsourcer.forkAndRedeem` calls.
* **`initialReporterRedeem`** (string) Sum of gas estimates for all `InitialReporter.forkAndRedeem` calls.
* **`all`** (string) Sum of all gas estimates for all calls.

<a name="GasEstimatesNonforkedMarketsTotals"></a>
### GasEstimatesNonforkedMarketsTotals  (Object)

#### **Properties:** 
* **`disavowCrowdsourcers`** (string) Sum of gas estimates for all `Market.disavowCrowdsourcers` calls.
* **`feeWindowRedeem`** (string) Sum of gas estimates for all `FeeWindow.redeem` calls.
* **`crowdsourcerRedeem`** (string) Sum of gas estimates for all `DisputeCrowdsourcer.redeem` calls.
* **`initialReporterRedeem`** (string) Sum of gas estimates for all `InitialReporter.redeem` calls.
* **`all`** (string) Sum of all gas estimates for all calls.

<a name="GetReportingFeesForkedMarket"></a>
### GetReportingFeesForkedMarket  (Object)

* **`isFinalized`** (boolean) Whether the Forked Market has been Finalized (i.e., the function `Market.finalize` has been called on it successfully).
* **`marketId`** (string) Ethereum contract address of the Forked Market, as a hexadecimal string.
* **`universe`** (string) Ethereum contract address of Universe to which the Forked Market belongs, as a hexadecimal string.
* **`crowdsourcers`** (Array.&lt;<a href="#CrowdsourcerState">CrowdsourcerState</a>>) Array of objects containing information about the Forked Market's DisputeCrowdsourcer contracts.
* **`initialReporter`** (<a href="#InitialReporterState">InitialReporterState</a>|null) Object containing information about the Forked Market's InitialReporter contract.

<a name="GetReportingFeesInfo"></a>
### GetReportingFeesInfo  (Object)

#### **Properties:** 
* **`feeWindows`** (Array.&lt;string>) Array of FeeWindow contract addresses with unclaimed REP, as hexadecimal strings.
* **`forkedMarket`** (<a href="#GetReportingFeesForkedMarket">GetReportingFeesForkedMarket</a>|null) GetReportingFeesForkedMarket object containing information about the Forked Market (if one exists in the specified universe).
* **`nonforkedMarkets`** (Array.&lt;<a href="#GetReportingFeesNonforkedMarket">GetReportingFeesNonforkedMarket</a>>) Array of GetReportingFeesNonforkedMarket objects containing unclaimed ETH/REP.
* **`total`** (<a href="#GetReportingFeesTotal">GetReportingFeesTotal</a>) Object containing information about the unclaimed ETH/REP and lost REP a specific user has in the specified Universe.

<a name="GetReportingFeesNonforkedMarket"></a>
### GetReportingFeesNonforkedMarket  (Object)

* **`crowdsourcers`** (Array.&lt;string>) Array of Ethereum contract addresses of the non-Forked Market's Crowdsourcers in which a specified user has unclaimed Reporting Fees, as hexadecimal strings.
* **`crowdsourcersAreDisavowed`** (boolean) Whether the non-Forked Market's DisputeCrowdsourcers have been disavowed (i.e., its `Market.disavowCrowdsourcers` function has been called successfully).
* **`initialReporter`** (string|null) Ethereum contract address of the non-Forked Market's InitialReporter in which a specified user has unclaimed Reporting Fees, as a hexadecimal string.
* **`isFinalized`** (boolean) Whether the non-Forked Market has been Finalized (i.e., its `Market.finalize` function has been called successfully).
* **`isMigrated`** (boolean) Whether the non-Forked Market has been migrated to the Child Universe of its original Universe (i.e., its `Market.migrateThroughOneFork` function has been called successfully).
* **`marketId`** (string) Ethereum contract address of the non-Forked Market, as a hexadecimal string.
* **`unclaimedEthFees`** (string)  Amount of unclaimed Reporting Fees the user has for the Market, in attoETH.
* **`unclaimedRepTotal`** (string)  Amount of unclaimed REP the user has staked in the Market, in attoREP.

<a name="GetReportingFeesTotal"></a>
### GetReportingFeesTotal  (Object)

#### **Properties:** 
* **`lostRep`** (string) AttoREP lost in losing Initial Reports/Crowdsourcers for Markets containing unclaimed ETH/REP.
* **`participationTokenRepStaked`** (string)  Total amount of REP the user currently has staked in Participation Tokens, in attoREP.
* **`unclaimedEth`** (string) Unclaimed attoETH fees from buying Participation Tokens or staking in Initial Reports/Crowdsourcers (even if the Outcome is not the Winning Outcome) of the specified Universe.
* **`unclaimedForkEth`** (string) Unclaimed attoETH fees for staking in the Initial Report/Crowdsourcers of the Forked Market (even if the Outcome is not the Winning Outcome) of the specified Universe.
* **`unclaimedForkRepStaked`** (string) Unclaimed attoREP Staked in the Initial Report/Crowsourcers of the Forked Market (where the Outcome is the Winning Outcome) of the specified Universe.
* **`unclaimedParticipationTokenEthFees`** (string)  Unclaimed ETH in Reporting Fees that the Reporter has earned from buying Participation Tokens, in attoETH.
* **`unclaimedRepEarned`** (string) Unclaimed attoREP used to stake in the Initial Report/Crowdsourcers of the specified universe (where the Outcome is Winning Outcome) of the specified Universe.
* **`unclaimedRepStaked`** (string) Unclaimed attoREP used to buy Participation Tokens or to stake in the Initial Report/Crowsourcers of the specified universe (where the Outcome is the Winning Outcome) of the specified Universe.

<a name="InitialReporter"></a>
### InitialReporter  (Object)

#### **Properties:** 
* **`marketId`** (string) Ethereum contract address of the Market for which the Initial Report was submitted.
* **`blockNumber`** (number) Block number where the Initial Report took place.
* **`logIndex`** (number) Log index where the Initial Report took place.
* **`timestamp`** (number) Unix timestamp when the Initial Report took place.
* **`transactionHash`** (string) Transaction hash of the Initial Report.
* **`reporter`** (string) Ethereum address of the Reporter who submitted the Initial Report.
* **`amountStaked`** (string) Amount of attoREP the Reporter Staked in the Initial Report.
* **`initialReporter`** (string) Ethereum address of the InitialReporter contract to which the Initial Report was submitted.
* **`redeemed`** (boolean) Whether the Reporter has redeemed their REP from the InitialReporter contract.
* **`isDesignatedReporter`** (boolean) Whether `reporter` was the Designated Reporter (as opposed to the First Public Reporter).
* **`repBalance`** (string) Amount of REP that the InitialReporter contract has as its balance.

<a name="InitialReporterState"></a>
### InitialReporterState  (Object)

* **`initialReporterId`** (string) Ethereum contract address of the InitialReporter contract belonging to a Forked Market, as a hexadecimal string.
* **`needsFork`** (boolean) Whether the InitialReporter contract needs to have its `InitialReporter.fork` function called before calling `InitialReporter.redeem`.

<a name="MarketCreatorFee"></a>
### MarketCreatorFee  (Object)

#### **Properties:** 
* **`marketId`** (string) Ethereum contract address of the Market, as a hexadecimal string.
* **`unclaimedFee`** (string) Unclaimed Creator Fee for the Market, in attoETH.

<a name="MarketCreationCost"></a>
### MarketCreationCost  (Object)

#### **Properties:** 
* **`designatedReportNoShowReputationBond`** (string) Amount of Reputation required to incentivize the designated reporter to show up and report, as a base-10 string.
* **`etherRequiredToCreateMarket`** (string) Sum of the Ether required to pay for Reporters' gas costs and the validity bond, as a base-10 string.

<a name="MarketCreationCostBreakdown"></a>
### MarketCreationCostBreakdown  (Object)

#### **Properties:** 
* **`designatedReportNoShowReputationBond`** (string) Amount of Reputation required to incentivize the designated reporter to show up and report, as a base-10 string.
* **`validityBond`** (string) Amount of Ether to be held on-contract and repaid when the Market is resolved with a non-Invalid Outcome, as a base-10 string.

<a name="MarketInfo"></a>
### MarketInfo  (Object)

#### **Properties:** 
* **`id`** (string) Address of a Market, as a hexadecimal string.
* **`universe`** (string) Address of a Universe, as a hexadecimal string.
* **`marketType`** (string) Type of Market ("yesNo", "categorical", or "scalar").
* **`numOutcomes`** (number) Total possible Outcomes for the Market.
* **`minPrice`** (string) Minimum price allowed for a share on a Market, in ETH. For Yes/No & Categorical Markets, this is 0 ETH. For Scalar Markets, this is the bottom end of the range set by the Market creator.
* **`maxPrice`** (string) Maximum price allowed for a share on a Market, in ETH. For Yes/No & Categorical Markets, this is 1 ETH. For Scalar Markets, this is the top end of the range set by the Market creator.
* **`cumulativeScale`** (string) Difference between maxPrice and minPrice.
* **`author`** (string) Ethereum address of the creator of the Market, as a hexadecimal string.
* **`creationTime`** (number) Timestamp when the Ethereum block containing the Market creation was created, in seconds.
* **`creationBlock`** (number) Number of the Ethereum block containing the Market creation.
* **`creationFee`** (string) Fee paid by the Market Creator to create the Market, in ETH.
* **`settlementFee`** (string) Fee extracted when a Complete Set is Settled. It is the combination of the Creator Fee and the Reporting Fee.
* **`reportingFeeRate`** (string) Percentage rate of ETH sent to the Fee Window containing the Market whenever shares are settled. Reporting Fees are later used to pay REP holders for Reporting on the Outcome of Markets.
* **`marketCreatorFeeRate`** (string) Percentage rate of ETH paid to the Market creator whenever shares are settled.
* **`marketCreatorFeesBalance`** (string) Amount of claimable fees the Market creator has not collected from the Market, in ETH.
* **`marketCreatorMailbox`** (string) Ethereum address of the Market Creator, as a hexadecimal string.
* **`marketCreatorMailboxOwner`** (string) Ethereum address of the Market Creator Mailbox, as a hexadecimal string.
* **`initialReportSize`** (string|null) Size of the No-Show Bond (if the Initial Report was submitted by a First Public Reporter instead of the Designated Reporter).
* **`category`** (string) Name of the category the Market is in.
* **`tags`** (Array.&lt;(string|null)>) Names with which the Market has been tagged.
* **`volume`** (string) Trading volume for this Outcome.
* **`openInterest`** (string) Open interest for the Market.
* **`outstandingShares`** (string) Number of Complete Sets in the Market.
* **`reportingState`** (<a href="#REPORTING_STATE">REPORTING_STATE</a>|null) Reporting state name.
* **`forking`** (boolean|number) Whether the Market has Forked.
* **`needsMigration`** (boolean|number) Whether the Market needs to be migrated to its Universe's Child Universe (i.e., the Market is not Finalized, and the Forked Market in its Universe is Finalized).
* **`feeWindow`** (string) Contract address of the Fee Window the Market is in, as a hexadecimal string.
* **`endTime`** (number) Timestamp when the Market event ends, in seconds.
* **`finalizationBlockNumber`** (number|null) Ethereum block number in which the Market was Finalized.
* **`finalizationTime`** (number|null) Timestamp when the Market was finalized (if any), in seconds.
* **`lastTradeBlockNumber`** (number|null) Ethereum block number in which the last trade occurred for this Market.
* **`lastTradeTime`** (number|null) Unix timestamp when the last trade occurred in this Market.
* **`description`** (string) Description of the Market.
* **`details`** (string|null) Stringified JSON object containing resolutionSource, tags, longDescription, and outcomeNames (for Categorical Markets).
* **`scalarDenomination`** (string|null) Denomination used for the numerical range of a Scalar Market (e.g., dollars, degrees Fahrenheit, parts-per-billion).
* **`designatedReporter`** (string) Ethereum address of the Market's designated report, as a hexadecimal string.
* **`designatedReportStake`** (string) Size of the Designated Reporter Stake, in attoETH, that the Designated Reporter must pay to submit the Designated Report for this Market.
* **`resolutionSource`** (string|null) Reference source used to determine the Outcome of the Market event.
* **`numTicks`** (string) Number of possible prices, or ticks, between a Market's minimum price and maximum price.
* **`tickSize`** (string) Smallest recognized amount by which a price of a security or future may fluctuate in the Market.
* **`consensus`** (<a href="#NormalizedPayout">NormalizedPayout</a>|null) Consensus Outcome for the Market.
* **`outcomes`** (Array.&lt;<a href="#OutcomeInfo">OutcomeInfo</a>>) Array of OutcomeInfo objects.

<a name="MarketPriceTimeSeries"></a>
### MarketPriceTimeSeries  (Object)

#### **Properties:** 
* **`Price`** (<a href="#SingleOutcomePriceTimeSeries">SingleOutcomePriceTimeSeries</a>) time-series for a single Outcome, keyed by Outcome ID.

<a name="MarketTradingPosition"></a>
### MarketTradingPosition  (Object)

#### **Properties:** 
* **`realized`** (string) Profit a user made for total historical positions which have _since been closed_ in a market outcome (i.e., `realized` is accrued profit for Shares a user previously owned).
* **`unrealized`** (string) Percent profit a user would have on just their current `netPosition` if they were to close it at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome.
* **`total`** (string) `unrealized` plus `realized` (i.e., is the profit a user made on previously owned Shares in a Market Outcome, plus what they could make if they closed their current `netPosition` in that Outcome).
* **`unrealizedCost`** (string) Amount of ETH a user paid to open their current
net position in that Market Outcome. This is a cashflow amount that the user remitted based on Share price not trade price. For example, if a user opens a short position for one Share in a YesNo Market at a trade price of 0.2, then the unrealized cost is `MarketMaxPrice=1.0 - TradePrice=0.2 --> SharePrice=0.8 * 1 share --> UnrealizedCost=0.8`. In Categorical Markets, the user may pay Shares of other Outcomes in lieu of ETH, which doesn't change the calculation for `unrealizedCost`, but it does mean that (in a Categorical Market) `unrealizedCost` may be greater than the actual ETH a user remitted.
* **`realizedCost`** (string) Amount of ETH a user paid for the total historical cost to open all positions which have _since been closed_ for that Market Outcome. (ie., `realizedCost` is accrued cost for Shares a user previously owned). `realizedCost` is a cashflow amount that the user remitted based on Share price not trade price).
* **`totalCost`** (string) `unrealizedCost` plus `realizedCost` (i.e., `totalCost` is the cashflow amount the user remitted, based on Share price not trade price, for all shares they ever bought in this Market Outcome).
* **`realizedPercent`** (string) Percent profit a user made for total historical positions which have _since been closed_ in a market outcome (i.e., `realizedPercent` is accrued profit percent for Shares a user previously owned). `realizedPercent` is `realized` divided by `realizedCost`.
* **`unrealizedPercent`** (string) Percent profit a user would have on just their current `netPosition` if they were to close it at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome. `unrealizedPercent` is `Unrealized` divided by `unrealizedCost`.
* **`totalPercent`** (string) `total` divided by `totalCost` (i.e., `totalPercent` is the total/final percent profit a user would make if they closed their `netPosition` at the last price). In other words, TotalProfitPercent is what `realizedPercent` _would become_ if the user closed their `netPosition` at the last price.
* **`unrealizedRevenue`** (string) amount of ETH a user would receive for their current `netPosition` if they were to close that position at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome. For example if a user has a long position of 10 Shares in a YesNo market, and the last price is 0.75, then `NetPosition=10 * LastPrice=0.75 --> UnrealizedRevenue=7.5`.
* **`unrealizedRevenue24hAgo`** (string) Same as `unrealizedRevenue`, but calculated using the last trade price from 24 hours ago, as if the user held this position constant for the past 24 hours. But, if the user (further) opened their current position within the past 24 hours, then the price at which the position was opened is used instead of the actual last trade price from 24 hours ago.
* **`unrealizedRevenue24hChangePercent`** (string) Percent change in `unrealizedRevenue` from 24 hours ago.
* **`frozenFunds`** (string) ETH that a user has given up (locked in escrow or given to a counterparty) to obtain their current position.
* **`marketId`** (string) Ethereum address of the market in which the user holds this position.
* **`timestamp`** (number) Unix timestamp at which the user held this position.

<a name="Meta"></a>
### Meta  (Object)

Authentication metadata for raw transactions.

#### **Properties:** 
* **`accountType`** (string) Type of account that is signing the transaction. Possible values include "privateKey", "ledger", "trezor", "edge", and "unlockedEthereumNode".
* **`address`** (string) Ethereum address that is making the transaction, as a hexadecimal string.
* **`signer`** (buffer|function) Private key buffer or a signing function provided by a hardware wallet, of the account initiating the transaction.

<a name="NoKeystoreAccount"></a>
### NoKeystoreAccount  (Object)

#### **Properties:** 
* **`address`** (string) This account's Ethereum address, as a hexadecimal string.
* **`privateKey`** (buffer) The private key for this account.
* **`derivedKey`** (buffer) The secret key (derived from the password) used to encrypt this account's private key.

<a name="NormalizedPayout"></a>
### NormalizedPayout  (Object)

#### **Properties:** 
* **`isInvalid`** (boolean|number) Whether the Outcome is Invalid.
* **`payout`** (Array.&lt;number|string>) Payout Set for the Dispute Crowdsourcer.

<a name="Order"></a>
### Order  (Object)

#### **Properties:** 
* **`orderId`** (string) ID of the order, as a 32-byte hexadecimal string.
* **`shareToken`** (string) Contract address of the share token for which the order was placed, as a hexadecimal string.
* **`transactionHash`** (string) Hash to look up the order transaction receipt.
* **`logIndex`** (number) Number of the log index position in the Ethereum block containing the order transaction.
* **`owner`** (string) The order maker's Ethereum address, as a hexadecimal string.
* **`creationTime`** (number) Timestamp, in seconds, when the Ethereum block containing the order transaction was created.
* **`creationBlockNumber`** (number) Number of the Ethereum block containing the order transaction.
* **`orderState`** (<a href="#ORDER_STATE">ORDER_STATE</a>) State of orders by which to filter results. Valid values are "ALL", "CANCELED", "CLOSED", & "OPEN".
* **`price`** (string) Rounded display price, as a base-10 number.
* **`amount`** (string) Current rounded number of shares to trade, as a base-10 number.
* **`originalAmount`** (string) Original rounded number of shares to trade, as a base-10 number.
* **`fullPrecisionPrice`** (string) Full-precision (un-rounded) display price, as a base-10 number.
* **`fullPrecisionAmount`** (string) Current full-precision (un-rounded) number of shares to trade, as a base-10 number.
* **`originalFullPrecisionAmount`** (string)  Original full-precision (un-rounded) number of shares to trade, as a base-10 number.
* **`originalTokensEscrowed`** (string)  Original number of the order maker's tokens held in escrow, as a base-10 number.
* **`originalSharesEscrowed`** (string)  Original number of the order maker's shares held in escrow, as a base-10 number.
* **`tokensEscrowed`** (string) Current number of the order maker's tokens held in escrow, as a base-10 number.
* **`sharesEscrowed`** (string) Current number of the order maker's shares held in escrow, as a base-10 number.
* **`canceledBlockNumber`** (number|null) Block number in which the order cancellation took place (if any).
* **`canceledTransactionHash`** (string|null) Transaction hash in which the order cancellation took place (if any).
* **`canceledTime`** (number|null) Unix timestamp when the order was canceled (if any).

<a name="ORDER_STATE"></a>
### ORDER_STATE  (Object)

Serves as an enum for the state of an order.

#### **Properties:** 
* **`ALL`** (string) Order is open, closed, or canceled. (If no order state is specified, this is the default value.)
* **`OPEN`** (string) Order is available to be filled.
* **`CLOSED`** (string) Order has been filled.
* **`CANCELED`** (string) Order has been canceled (although it may have been partially filled).

<a name="OutcomeInfo"></a>
### OutcomeInfo  (Object)

#### **Properties:** 
* **`id`** (number) Market Outcome ID
* **`volume`** (string) Trading volume for this Outcome.
* **`price`** (string) Last price at which the outcome was traded. If no trades have taken place in the Market, this value is set to the Market midpoint. If there is no volume on this Outcome, but there is volume on another Outcome in the Market, `price` is set to 0 for Yes/No Markets and Categorical Markets.
* **`description`** (string|null) Description for the Outcome.

<a name="ProfitLoss"></a>
### ProfitLoss  (Object)

#### **Properties:**
* **`meanOpenPrice`**  (string) Mean price of trades at time of buy-in, in attoETH.
* **`position`**  (string) Net trading position, where the quantity is the number of Share Units. An overall "sell" position is negative, and an overall "buy" position is positive.
* **`realized`**  (string) Amount of realized profits or losses from all trades, in attoETH.
* **`unrealized`**  (string) Unrealized profit/loss in attoETH, calculated as Share Units held * (last trade price - price on buy-in).
* **`total`**  (string) Sum of realized and unrealized profit/loss.

<a name="Report"></a>
### Report  (Object)

#### **Properties:** 
* **`initialReporter`** (<a href="#ReportingParticipant">ReportingParticipant</a>) ReportingParticipant object containing information about the Market's Initial Reporter.
* **`crowdsourcers`** (Array.&lt;<a href="#ReportingParticipant">ReportingParticipant</a>>) Array of Crowdsourcers, as ReportingParticipant objects.

<a name="ReportingParticipant"></a>
### ReportingParticipant  (Object)

#### **Properties:** 
* **`transactionHash`** (string) Hash to look up the reporting transaction receipt.
* **`logIndex`** (number) Number of the log index position in the Ethereum block containing the reporting transaction.
* **`creationBlockNumber`** (number) Number of the Ethereum block containing the reporting transaction.
* **`blockHash`** (string) Hash of the Ethereum block containing the reporting transaction.
* **`creationTime`** (number) Timestamp, in seconds, when the Ethereum block containing the reporting transaction was created.
* **`marketId`** (string) Contract address of the Market, as a hexadecimal string.
* **`feeWindow`** (string) Fee Window the Market is in currently.
* **`payoutNumerators`** (Array.&lt;string>) Array representing the payout set.
* **`amountStaked`** (string) attoREP the Reporter has Staked on the Outcome of their Report.
* **`crowdsourcerId`** (string) Ethereum contract address of the Dispute Crowdsourcer, as a hexadecimal string.
* **`isCategorical`** (boolean) Whether the Market is a Categorical Market.
* **`isScalar`** (boolean) Whether the Market is a Scalar Market.
* **`isInvalid`** (boolean) Whether the Market is [Invalid](#invalid-outcome).
* **`isSubmitted`** (boolean) Whether the Report has been submitted. (This property is vestigial and is always set to true.)

<a name="REPORTING_STATE"></a>
### REPORTING_STATE  (Object)

Serves as an enum for the state of a Market.

#### **Properties:** 
* **`PRE_REPORTING`** (string) Market's end time has not yet come to pass.
* **`DESIGNATED_REPORTING`** (string) Market's end time has occurred, and it is pending a Designated Report.
* **`OPEN_REPORTING`** (string) The Designated Reporter failed to submit a Designated Report within the allotted time, causing the Market to enter the Open Reporting Phase.
* **`CROWDSOURCING_DISPUTE`** (string) An Initial Report for the Market has been submitted, and the Market's Tentative Outcome is open to being Disputed.
* **`AWAITING_NEXT_WINDOW`** (string) Either the Market had an Initial Report submitted in the current Fee Window, or one of the Market's Dispute Crowdsourcers received enough REP to Challenge the Market's Tentative Outcome. In either case, the Market is awaiting the next Fee Window in order to enter another Dispute Round.
* **`AWAITING_FINALIZATION`** (string) The Market has been Finalized, but the [Post-Finalization Waiting Period](#post-finalization-waiting-period) has not elapsed.
* **`FINALIZED`** (string) An Outcome for the Market has been determined.
* **`FORKING`** (string) The Dispute Crowdsourcer for one of the Market's Outcomes received enough REP to reach the Fork Threshold, causing a fork. Users can migrate their REP to the Universe of their choice.
* **`AWAITING_FORK_MIGRATION`** (string) Market is waiting for another Market's Fork to be resolved. This means its Tentative Outcome has been reset to the Outcome submitted in the Initial Report, and all Stake in the Market's Dispute Crowdsourcers has been refunded to the users who Staked on them.

<a name="SimulatedTrade"></a>
### SimulatedTrade  (Object)

#### **Properties:** 
* **`sharesFilled`** (string) Number of Shares Filled by the trade.
* **`settlementFees`** (string) Projected Settlement Fees paid on this trade, as a base-10 string.
* **`sharesDepleted`** (string)  Projected number of Shares of the traded Outcome spent on this trade, as a base-10 string.
* **`otherSharesDepleted`** (string) Projected number of Shares of the other (non-traded) Outcomes spent on this trade, as a base-10 string.
* **`tokensDepleted`** (string) Projected number of tokens spent on this trade, as a base-10 string.
* **`shareBalances`** (Array.&lt;string>}  Projected final balances after the trade is complete, as an array of base-10 strings.
* **`worstCaseFees`** (string) Maximum amount of Settlement Fees to be paid, as a base-10 string.

<a name="SingleSideOrderBook"></a>
### SingleSideOrderBook  (Object)

#### **Properties:** 
 * **`buy`** (Object|null) Buy (bid) <a href="#Order">Order</a> objects, keyed by Order ID.
 * **`sell`** (Object|null)  Sell (ask) <a href="#Order">Order</a> objects, keyed by Order ID.

<a name="SingleOutcomePriceTimeSeries"></a>
### SingleOutcomePriceTimeSeries  (Object)

#### **Properties:** 
* **`Array`** (Array.&lt;<a href="#TimestampedPrice">TimestampedPrice</a>>) of timestamped price points for this Outcome.

<a name="StakeDetails"></a>
### StakeDetails  (Object)

#### **Properties:** 
* **`payout`** (Array.&lt;number|string>) Payout Set for the Dispute Crowdsourcer.
* **`isInvalid`** (boolean|number) Whether the Outcome is Invalid.
* **`bondSizeCurrent`** (string|null) Amount of attoREP needed to successfully Dispute the Tentative Outcome of this Market in the current Fee Window. Is null if `tentativeWinning` is true.
* **`bondSizeTotal`** (string|null) Total attoREP required to make this Outcome become the Tentative Outcome. (That is, the sum of `bondSizeCurrent` and `stakeCompleted`.) Is null if `tentativeWinning` is true.
* **`stakeCurrent`** (string|null) Amount of attoREP Staked on this Outcome for the current Dispute Round. Is null if `tentativeWinning` is true.
* **`stakeRemaining`** (string|null) Amount of attoREP that this Outcome must receive in order to become the Tentative Outcome for the Market. Is null if `tentativeWinning` is true.
* **`accountStakeCompleted`** (string|null) Amount of attoREP the specified `account` has Staked in this Outcome during the current Dispute Round. Is null if `tentativeWinning` is true.
* **`accountStakeCurrent`** (string|null) Amount of attoREP the specified `account` has Staked in this Outcome during the current Dispute Round. Is null if `tentativeWinning` is true.
* **`accountStakeTotal`** (string|null) Amount of attoREP the specified `account` has Staked on this Outcome. Is null if `tentativeWinning` is true.
* **`stakeCompleted`** (string) Amount of attoREP Staked in this Outcome to cause it to become the Tentative Outcome (either after the First Public Report or after a Dispute Round ended).
* **`tentativeWinning`** (boolean) Whether this Outcome is the Tenative Outcome for the Market.

<a name="StakeInfo"></a>
### StakeInfo  (Object)

#### **Properties:** 
* **`marketId`** (string) Ethereum contract address of the Market.
* **`disputeRound`** (number|null) Dispute round the Market is currently in. (This will be 1 until someone contributes to a Crowdsourcer.) 
* **`stakeCompletedTotal`** (string) Total attoREP that has been Staked in Crowdsourcers and in the First Public Report.
* **`bondSizeOfNewStake`** (string) Amount of attoREP needed to Dispute the Tentative Outcome of the Market.
* **`stakes`** (Array.&lt;<a href="#StakeDetails">StakeDetails</a>>) 

<a name="SuccessfulTransactionsForkedMarket"></a>
### SuccessfulTransactionsForkedMarket  (Object)

#### **Properties:** 
* **`crowdsourcerForkAndRedeem`** (Array.&lt;string>) Array of DisputeCrowdsourcer contract addresses that had succeessful calls to `DisputeCrowdsourcer.forkAndRedeem`.
* **`initialReporterForkAndRedeem`** (Array.&lt;string>) Array of InitialReporter contract addresses that had succeessful calls to `InitialReporter.forkAndRedeem`.
* **`crowdsourcerRedeem`** (Array.&lt;string>) Array of DisputeCrowdsourcer contract addresses that had succeessful calls to `DisputeCrowdsourcer.redeem`.
* **`initialReporterRedeem`** (Array.&lt;string>) Array of InitialReporter contract addresses that had succeessful calls to `InitialReporter.redeem`.

<a name="SuccessfulTransactionsNonforkedMarkets"></a>
### SuccessfulTransactionsNonforkedMarkets  (Object)

#### **Properties:** 

* **`disavowCrowdsourcers`** (Array.&lt;string>) Array of Market contract addresses that had successful calls to `Market.disavowCrowdsourcers`.
* **`feeWindowRedeem`** (Array.&lt;string>) Array of FeeWindow contract addresses that had successful calls to `FeeWindow.redeem`.
* **`crowdsourcerRedeem`** (Array.&lt;string>) Array of DisputeCrowdsourcer contract addresses that had successful calls to `DisputeCrowdsourcer.redeem`.
* **`initialReporterRedeem`** (Array.&lt;string>) Array of InitialReporter contract addresses that had successful calls to `InitialReporter.redeem`.

<a name="SyncData"></a>
### SyncData  (Object)

#### **Properties:** 
* **`addresses`** (Object) Object containing the 20-byte Ethereum contract addresses used by Augur, keyed by contract name.
* **`highestBlock`** (<a href="#SyncDataBlock">SyncDataBlock</a>) The most recently added block on the Ethereum blockchain.
* **`isSyncFinished`** (boolean) Whether Augur Node has finished synching with the Augur logs on the Ethereum blockchain.
* **`lastProcessedBlock`** (<a href="#SyncDataBlock">SyncDataBlock</a>) The most recent block on the Ethereum blockchain that has been processed by Augur Node and stored in its database.
* **`netId`** (string) Network ID that Augur Node is connected to. (This is the same ID as `net_version`.)
* **`net_version`** (string) Network ID that Augur Node is connected to. 
* **`version`** (string) Version of the Augur smart contracts.

<a name="SyncDataBlock"></a>
### SyncDataBlock  (Object)

#### **Properties:** 
* **`hash`** (string) Block hash of the block on the Ethereum blockchain, as a 32-byte hexadecimal value.
* **`number`** (number) Block number.
* **`timestamp`** (number) Unix timestamp when the block was created.

<a name="Tag"></a>
### Tag  (Object)

#### **Properties:** 
* **`nonFinalizedOpenInterest`** (string) Sum of Open Interest in non-Finalized Markets in this aggregation, in ETH.
* **`numberOfMarketsWithThisTag`** (number) Number of Markets with this Tag in the corresponding Category.
* **`openInterest`** (string) Sum of Open Interest in all Markets in this aggregation, in ETH.
* **`tagName`** (string) Name of the Tag.

<a name="TimestampedPrice"></a>
### TimestampedPrice  (Object)

#### **Properties:** 
* **`price`** (string) Display (non-normalized) price, as a base-10 number.
* **`amount`** (string) Display price, as a base-10 number.
* **`timestamp`** (number) Unix timestamp for this price in seconds, as an integer.

<a name="TradeCost"></a>
### TradeCost  (Object)

#### **Properties:** 
* **`cost`** (string) Wei (attoEther) value needed for this trade.
* **`onChainAmount`** (string) On-chain number of Shares for this trade.
* **`onChainPrice`** (string) On-chain price for this trade.

<a name="TradingPosition"></a>
### TradingPosition  (Object)

#### **Properties:** 
* **`realized`** (string) Profit a user made for total historical positions which have _since been closed_ in a market outcome (i.e., `realized` is accrued profit for Shares a user previously owned).
* **`unrealized`** (string) Percent profit a user would have on just their current `netPosition` if they were to close it at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome.
* **`total`** (string) `unrealized` plus `realized` (i.e., is the profit a user made on previously owned Shares in a Market Outcome, plus what they could make if they closed their current `netPosition` in that Outcome).
* **`unrealizedCost`** (string) Amount of ETH a user paid to open their current
net position in that Market Outcome. This is a cashflow amount that the user remitted based on Share price not trade price. For example, if a user opens a short position for one Share in a YesNo Market at a trade price of 0.2, then the unrealized cost is `MarketMaxPrice=1.0 - TradePrice=0.2 --> SharePrice=0.8 * 1 share --> UnrealizedCost=0.8`. In Categorical Markets, the user may pay Shares of other Outcomes in lieu of ETH, which doesn't change the calculation for `unrealizedCost`, but it does mean that (in a Categorical Market) `unrealizedCost` may be greater than the actual ETH a user remitted.
* **`realizedCost`** (string) Amount of ETH a user paid for the total historical cost to open all positions which have _since been closed_ for that Market Outcome. (ie., `realizedCost` is accrued cost for Shares a user previously owned). `realizedCost` is a cashflow amount that the user remitted based on Share price not trade price).
* **`totalCost`** (string) `unrealizedCost` plus `realizedCost` (i.e., `totalCost` is the cashflow amount the user remitted, based on Share price not trade price, for all shares they ever bought in this Market Outcome).
* **`realizedPercent`** (string) Percent profit a user made for total historical positions which have _since been closed_ in a market outcome (i.e., `realizedPercent` is accrued profit percent for Shares a user previously owned). `realizedPercent` is `realized` divided by `realizedCost`.
* **`unrealizedPercent`** (string) Percent profit a user would have on just their current `netPosition` if they were to close it at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome. `unrealizedPercent` is `Unrealized` divided by `unrealizedCost`.
* **`totalPercent`** (string) `total` divided by `totalCost` (i.e., `totalPercent` is the total/final percent profit a user would make if they closed their `netPosition` at the last price). In other words, TotalProfitPercent is what `realizedPercent` _would become_ if the user closed their `netPosition` at the last price.
* **`unrealizedRevenue`** (string) amount of ETH a user would receive for their current `netPosition` if they were to close that position at the last price for that Market Outcome. The last price is the most recent price paid by anyone trading on that Outcome. For example if a user has a long position of 10 Shares in a YesNo market, and the last price is 0.75, then `NetPosition=10 * LastPrice=0.75 --> UnrealizedRevenue=7.5`.
* **`unrealizedRevenue24hAgo`** (string) Same as `unrealizedRevenue`, but calculated using the last trade price from 24 hours ago, as if the user held this position constant for the past 24 hours. But, if the user (further) opened their current position within the past 24 hours, then the price at which the position was opened is used instead of the actual last trade price from 24 hours ago.
* **`unrealizedRevenue24hChangePercent`** (string) Percent change in `unrealizedRevenue` from 24 hours ago.
* **`frozenFunds`** (string) ETH that a user has given up (locked in escrow or given to a counterparty) to obtain their current position.
* **`marketId`** (string) Ethereum address of the market in which the user holds this position.
* **`timestamp`** (number) Unix timestamp at which the user held this position.
* **`position`** (string) Shares the user has bought ("long" position) or sold ("short" position) in this Market Outcome.
* **`netPosition`** (string) Number of Shares a user currently owns in a Market Outcome. If `netPosition` is positive (negative), the user has a "long" ("short") position and earns money if the price goes up (down). If `netPosition` is zero the position is said to be "closed". In the context of a trade, `netPosition` is prior to the trade being processed.
* **`outcome`** (number) Market Outcome in which the user has this position.
* **`averagePrice`** (string) Average per-Share trade price at which the user opened their position.
* **`lastTradePrice`** (string) Price in ETH at which a trade executed. A trade is always on a single Market Outcome. `lastTradePrice` is the price shown in the UI looking at the Order Book or historical price chart.
* **`lastTradePrice24hAgo`** (string) As of 24 hours ago, the last (most recent) price in ETH at which this Outcome was traded by anybody.
* **`lastTradePrice24hChangePercent`** (string) Percent change in `lastTradePrice` from 24 hours ago.

<a name="UnclaimedFeeWindowInfo"></a>
### UnclaimedFeeWindowInfo  (Object)

#### **Properties:** 
* **`startTime`** (number) Unix timestamp when the Fee Window begins.
* **`endTime`** (number) Unix timestamp when the Fee Window ends.
* **`balance`** (string) Balance the user has Staked in the Fee Window, in attoREP.
* **`expectedFees`** (string) Expected Reporting Fees, in attoREP, that will be withdrawn when the user redeems their Stake in the Fee Window.

<a name="UserTrade"></a>
### UserTrade  (Object)

#### **Properties:** 
* **`transactionHash`** (string) Hash to look up the trade transaction receipt.
* **`logIndex`** (number) Number of the log index position in the Ethereum block containing the trade transaction.
* **`orderId`** (string) Unique ID for the Order, as a hexadecimal string.
* **`type`** (string) Type of trade, from the perspective of the specified account. Valid values are "buy" and "sell".
* **`price`** (string) Price paid for trade, in attoETH.
* **`amount`** (string) Amount of Share Units that were bought/sold.
* **`maker`** (boolean) Whether the specified user is the order maker (as opposed to filler).
* **`marketCreatorFees`** (string) Amount of fees paid to Market creator, in ETH.
* **`reporterFees`** (string) Amount of fees paid to reporters, in attoETH.
* **`selfFilled`** (boolean) Whether the user filled his/her own Order.
* **`creator`** (string)  Ethereum address of the Order Creator, as a hexadecimal string.
* **`filler`** (string)  Ethereum address of the Order Filler, as a hexadecimal string.
* **`marketId`** (string) Contract address of the Market, as a hexadecimal string.
* **`outcome`** (number) Outcome being bought/sold.
* **`shareToken`** (string) Contract address of the share token that was bought or sold, as a hexadecimal string.
* **`timestamp`** (number) Unix timestamp when the trade was placed.
* **`tradeGroupId`** (number|null) ID logged with each trade transaction (can be used to group trades client-side), as a hexadecimal string.

<a name="UserTradePositionsInfo"></a>
### UserTradePosition  (Object)

#### **Properties:** 
* **`tradingPositions`** (Array<TradingPosition>)  Per-Outcome TradingPosition, where unrealized profit is relative to an Outcome's last price (as traded by anyone).
* **`tradingPositionsPerMarket`** (Array<MarketTradingPosition>)  Per-market aggregation of trading positions
* **`tradingPositionsTotal`** (AggregatedTradingPosition|undefined)  Portfolio-level aggregation of all of the user's trading positions. Undefined if and only if `getUserTradingPositions` was filtered by marketId
* **`frozenFundsTotal`** (FrozenFunds|undefined)  User's total frozen funds. Undefined if and only if `getUserTradingPositions` was filtered by marketId. WARNING - `frozenFundsTotal` is greater than `tradingPositionsTotal`.`frozenFunds` (in general) because `frozenFundsTotal` also includes the sum of Market Validity Bonds for active Markets this user created.

<a name="WebSocket"></a>
### WebSocket  (Object)

#### **Properties:** 
* **`binaryType`** (string) String indicating the type of binary data being transmitted by the connection. This should be either "blob" if DOM Blob objects are being used or "arraybuffer" if ArrayBuffer objects are being used.
* **`bufferedAmount`** (number) Number of bytes of data that have been queued using calls to send() but not yet transmitted to the network. This value resets to zero once all queued data has been sent. This value does not reset to zero when the connection is closed; if send() continues to be called, this will continue to climb.
* **`extensions`** (string) Extensions selected by the server. This is currently only the empty string or a list of extensions as negotiated by the connection.
* **`onclose`** (function) Event listener to be called when the WebSocket connection's readyState changes to CLOSED. The listener receives a CloseEvent named "close".
* **`onerror`** (function) Event listener to be called when an error occurs. This is a simple event named "error".
* **`onmessage`** (function) Event listener to be called when a message is received from the server. The listener receives a MessageEvent named "message".
* **`onopen`** (function) Event listener to be called when the WebSocket connection's readyState changes to OPEN; this indicates that the connection is ready to send and receive data. The event is a simple one with the name "open".
* **`protocol`** (string) String indicating the name of the sub-protocol the server selected; this will be one of the strings specified in the protocols parameter when creating the WebSocket object.
* **`readyState`** (number) Current state of the connection (0 for CONNECTING, 1 for OPEN, 2 for CLOSING, 3 for CLOSED).
* **`url`** (string) URL as resolved by the constructor. This is always an absolute URL.

<a name="WsTransport"></a>
### WsTransport  (Object)

#### **Properties:** 
* **`address`** (string) Address to which the WebSocket should connect.
* **`timeout`** (number) Number of milliseconds to wait before timing out.
* **`messageHandler`** (function) Function used to dispatch RPC responses.
* **`workQueue`** (Array) Queue of RPC payloads to send.
* **`awaitingPump`** (boolean) Whether `workQueue` is waiting to be pumped.
* **`connected`** (boolean) Whether the WebSocket has a connection to `address`.
* **`backoffMilliseconds`** (number) Milliseconds to wait before attempting to reconnect (uses exponential backoff).
* **`nextListenerToken`** (number) Counter used to uniquely identify reconnect listeners and disconnect listeners.
* **`reconnectListeners`** (Object) Event listeners for reconnecting.
* **`disconnectListeners`** (Object) Event listeners for disconnecting.
* **`webSocketClient`** (<a href="#WebSocket">WebSocket</a>) WebSocket client object.