API Constants
========
augur.js contains a number of constants in the `augur.constants` object, which are listed below.

### augur.constants.AUGUR_UPLOAD_BLOCK_NUMBER (string)

Ethereum block number from which to start looking up event logs.

### augur.constants.BLOCKS_PER_CHUNK (number)

Number of block to read from the blockchain at a time. Set to 1/8 day's worth (i.e., seconds * minutes * hours / blocks_per_second / 8, or 60 * 60 * 24 / 15 / 8). Used by `augur.events.getAllAugurLogs`.

### augur.constants.CANCEL_ORDER_GAS (string)

Gas limit used when canceling an [Order](#order) on the [Order Book](#order-book).

### augur.constants.CONTRACT_INTERVAL (Object)

Object that acts as an enum containing the following values: 

* CLAIM_PROCEEDS_WAIT_TIME - Number of seconds that the [Post-Finalization Waiting Period](#post-finalization-waiting-period) lasts.
* DESIGNATED_REPORTING_DURATION_SECONDS - Maximum number of seconds the [Designated Reporting Phase](#designated-reporting-phase) can last.
* DISPUTE_ROUND_DURATION_SECONDS - Maximum number of seconds a [Dispute Round](#dispute-round-phase) can last.
* FORK_DURATION_SECONDS - Maximum number of seconds a [Fork Period](#fork-period) can last.

### augur.constants.CONTRACT_TYPE (Object)

Object that acts as an enum for different types of smart contracts.

### augur.constants.DEFAULT_CONNECTION_TIMEOUT (number)

Default connection timeout Augur uses when connecting to an Ethereum node, in milliseconds.

### augur.constants.DEFAULT_GASPRICE (number)

Default gas price Augur uses when making transactions.

### augur.constants.DEFAULT_MAX_GAS (string)

Default maximum gas limit Augur uses when making transactions, as a hexadecimal string.

### augur.constants.DEFAULT_NETWORK_ID (string)

Default Ethereum network to connect to.

### augur.constants.DEFAULT_NUM_TICKS (Object)

Object containing the default number of [Ticks](#tick) used when creating a new [Categorical Market](#categorical-market), keyed by number of [Outcomes](#outcome) the [Market](#market) has.

### augur.constants.DEFAULT_SCALAR_TICK_SIZE (string)

[Tick](#tick) size that is used when creating a [Scalar Market](#scalar-market) if one is not specified.

### augur.constants.ETERNAL_APPROVAL_VALUE (string)

Used when calling the `approve` function for [Cash](#cash), which is an [ERC-20](https://en.wikipedia.org/wiki/ERC20) wrapper for ETH that Augur uses internally. It is equal to 2^256 - 1, which is the maximum amount of Cash that can be approved for Augur to spend on behalf of a particular account.

### augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK (string)

Block number at which Augur Node will begin scanning for logged events emitted from Augur's smart contracts.

### augur.constants.GET_LOGS_DEFAULT_TO_BLOCK (string)

Block number up to which Augur Node will scan for logged events emitted from Augur's smart contracts.

### augur.constants.MAX_GAS_LIMIT_FOR_TRADE

Maximum gas limit used when calling `augur.trading.tradeUntilAmountIsZero`.

### augur.constants.MAX_FILLS_PER_TX (BigNumber)

Maximum number of Orders that `augur.trading.tradeUntilAmountIsZero` will attempt to fill in a single transaction.

### augur.constants.MAX_LOG_BYTES_PER_BLOCK (number)

Used to calculate how large a WebSocket frame to allow. This is a theoretical limit based on a block being completely filled with Transfer transactions.

### augur.constants.MAX_WEBSOCKET_FRAME_SIZE (number)

Uses augur.constants.MAX_LOG_BYTES_PER_BLOCK to calculate the maximum WebSocket frame size. Comes out to under 0.25GB (in the most extreme case) but prevents errors from being thrown.

### augur.constants.MINIMUM_TRADE_SIZE (BigNumber)

Minimum number of Share Units that can be bought/sold in a trade.

### augur.constants.ONE (BigNumber)

A BigNumber with the value of 1.

### augur.constants.ORDER_STATE (Object)

Object that acts as an enum containing the constants used to represent each of the states an [Order](#order) can be in.

### augur.constants.PARALLEL_LIMIT (number)

Maximum number of transactions to auto-submit in parallel.

### augur.constants.PLACE_ORDER_NO_SHARES (Object)

Object containing the gas cost for placing an Order that does not escrow shares, keyed by the number of Outcomes for the Market. Used by `augur.trading.tradeUntilAmountIsZero`.

### augur.constants.PLACE_ORDER_WITH_SHARES (Object)

Object containing the gas cost for placing an Order that escrows shares, keyed by the number of Outcomes for the Market. Used by `augur.trading.tradeUntilAmountIsZero`.

### augur.constants.PRECISION (Object)

Object that acts as an enum for different types of precision using BigNumbers.

### augur.constants.REPORTING_STATE (Object)

Object that acts as an enum containing the constants used to represent each of the [Reporting](report) states a [Market](#market) can be in.

### augur.constants.STAKE_TOKEN_STATE (Object)

Object that acts as an enum for all of the possible states for a Stake Token (typically referred to as a [Dispute Token](#dispute-token)).

### augur.constants.SUBSCRIPTION_EVENT_NAMES (Object)

Object that acts as an enum for all of the events emitted by Augur Node.

### augur.constants.TRADE_GAS (string)

Gas limit used when calling `augur.trading.tradeUntilAmountIsZero`.

### augur.constants.TRADE_GAS_BUFFER (BigNumber)

Buffer used by `augur.trading.tradeUntilAmountIsZero` when estimating gas for filling orders. This is used to account for the fluctuation in the cost of fills.

### augur.constants.TRADE_GROUP_ID_NUM_BYTES (number)

Number of bytes that comprise a trade group ID. (Trade group IDs are used by Augur's UI to uniquely identify a trade.)

### augur.constants.WORST_CASE_FILL (Object)

Object containing constants used by `augur.trading.tradeUntilAmountIsZero` to calculate the gas limit for placing trades, keyed by the number of Outcomes of the Market.

### augur.constants.ZERO (BigNumber)

A BigNumber with the value of 0.