## Augur v2 subgraph

This subgraph aims to make it simple to get data from the Augur protocol, to simplify app development by transforming the raw data from the blockchain events into entities that should make it easier to understand how the protocol works and how entities are linked together.

### Entities

Here we will provide a list of the current entities implemented, and how they are related to the event data that we extracted.

#### User

``` graphql
type User @entity {
  id: ID!

  "Balance entities for tokens such as Reputation and Participation tokens"
  userTokenBalances: [UserTokenBalance!]! @derivedFrom(field: "user")

  "Markets created by this user"
  marketsCreated: [Market!]! @derivedFrom(field: "creator")

  "Markets where this user is the designated reporter"
  marketsAsReporter: [Market!]! @derivedFrom(field: "designatedReporter")

  "Share tokens that this user has"
  shareTokens: [ShareToken!]! @derivedFrom(field: "owner")
}
```

The user entity basically depicts a user of the Augur protocol.

It will have linked data about the different balances it has for the main tokens, such as Reputation (REP), Participation tokens and DisputeCrowdsourcer contributions, as well as all the shares they own on different markets, and the different markets they have created or currently own.

The ID of the users will be the blockchain address of said User.

#### Universe

```graphql
type Universe @entity {
  id: ID!

  parentUniverse: Universe

  payoutNumerators: [BigInt!]

  "Universe creation timestamp"
  creationTimestamp: BigInt

  "Latest universal value for the noShowBond charged on market creation"
  noShowBond: BigInt

  "Latest universal value for the validityBond charged on market creation"
  validityBond: BigInt

  "Latest universal value for the reporting fee charged on settlements"
  reportingFee: BigInt

  "Latest universal value for the value a designated reported is required to stake on the initial report"
  designatedReportStake: BigInt

  "Latest warpSync file hash"
  warpSyncHash: BigInt

  markets: [Market!]! @derivedFrom(field: "universe")

  "Children universe that this universe created when it forked. It can be null if the universe hasn't forked"
  children: [Universe!] @derivedFrom(field: "parentUniverse")
}
```

Universes are an Augur entity that represent a context for the markets. On initial deployment there will be only one Universe, the Genesis Universe.
Each time a market "forks", the current universe will "stop", and it will create children universes that will represent the different disputing outcomes of the "forking market".
All Augur REP holders will then have a time window (currently 60 days) to migrate their REP to one of the children universes, and the winner universe (the one which holds the most REP) will be the new main universe.

Since universes are a context entity for markets, they hold global information used by markets, like the current value for "Validity bond", "No show bond", reporting fees, and designated report stake, which are used by markets to determine the cost of creation, base fees applied on settlement and more.

We display all those variables, and track the markets that the universe currently holds, as well as the children and parent universes (if applicable), and the warp sync file hash, used for faster syncing of the augur node, if needed.

#### Market

```graphql
type Market @entity {
  id: ID!

  "Universe that this market belongs to"
  universe: Universe!

  "User that created the market"
  creator: User!

  "Current owner of the market"
  owner: User!

  "Extra information in JSON format. Includes market description and possibly other information"
  extraInfoRaw: String!

  "Description parsed from the extra info field. Could be null if not present in the JSON"
  description: String

  "Long description parsed from the extra info field. Could be null if not present in the JSON"
  longDescription: String

  "Category array parsed from the extra info field. Could be null if not present in the JSON"
  categories: [String!]

  "Scalar denomination parsed from the extra info field. Could be null if not present in the JSON"
  scalarDenomination: Boolean

  "Offset name parsed from the extra info field. Could be null if not present in the JSON"
  offsetName: String

  "Market template parsed from the extra info field. Could be null if not present in the JSON"
  template: MarketTemplate

  "Template inputs selected on market creation. Could be null if not present in the JSON"
  templateInputs: [MarketTemplateInput!]! @derivedFrom(field: "market")

  "Number of Ticks in a complete set"
  numTicks: BigInt!

  "Designated user that should report the "
  designatedReporter: User!

  "Timestamp depicting the end of the real world event for that market"
  endTimestamp: BigInt!

  "Minimum and maximum price for yes/no and categorical markets. For scalar markets it depicts the min and max values of the scalar."
  prices: [BigInt!]!

  "Internal enum id of the market type"
  marketTypeRaw: Int!

  "Market type as a string enum"
  marketType: MarketType!

  "Possible outcomes of the market"
  outcomes: [Outcome!]! @derivedFrom(field:"market")

  "Amount of different outcomes for the market."
  numOutcomes: Int!

  "Creation timestamp"
  timestamp: BigInt!

  "NoShowBond payed on creation"
  noShowBond: BigInt!

  "Current status of the market"
  status: MarketStatus!

  openInterest: BigInt

  "Entity depicting the current tentative or final result of the market"
  report: MarketReport

  "List of all the market events triggered"
  events: [MarketEvent!]! @derivedFrom(field: "market")

  "Share tokens traded on this market"
  shareTokens: [ShareToken!]! @derivedFrom(field: "market")

  "Entity depicting the disputing process"
  dispute: Dispute
}
```

A Market is basically a question about a "Real-World" event that is going to happen, which intends to give a reasonable prediction regarding the Outcome of this event.

Markets are the heart of the Augur protocol, they represent the market prediction, and hold the information of all the trading, reporting, disputing and settlement for any prediction.

Markets have a "lifecycle" that consist on different phases, where users can perform different actions. To make it simple, we added a market status, which tells you the current status (or phase) of this lifecycle. The different status for a market are:

* Trading: When a market is still open for buying and selling shares.
* Reporting: When a market is waiting for the initial reporting of the outcome or waiting for the initial report to be disputed.
* Disputing: When the initial outcome has been disputed, and the market is currently on a dispute window.
* Finalized: When the market dispute round finished succesfully (no new dispute to the outcome happened).
* Settled: When the market finishes with the settlement of all payments

This entity tracks all the data we could find on all the Market related events, such as the fees paid on creation, the current "open interest" of the market, the current status of the dispute process (more on that later), the market type, creation timestamp, the different possible outcomes for the market, minimum and maximum prices, market trading close time, and also parse the extra information provided as a JSON, to simplify usage of the API.

We track and save all the Market events that we handled to get the current status, in case it wants to be displayed, and we try to keep the raw data that we handled in them, in case it's ever needed, and also track of all the share tokens for any market, so that it's easy to find the share balances for any user on that market.

#### Market Type

There are 3 different Market Types in Augur, which are the following:

* Yes/No Markets
* Categorical Markets
* Scalar Markets

Yes/No Markets and Categorical Markets are mostly the same, with the exception that Yes/No markets only have 3 fixed outcomes: Yes, No and Invalid (All markets can be Invalid, so it's always a possible Outcome), and Categorical Markets can have up to 8 custom outcomes (for a total of 9, counting Invalid).

Scalar markets on the other hand can either be Invalid, or they can have an outcome defined within a numerical range. They use some of the market settings (such as min and max price, and number of ticks) in a different way, to allow for this range outcome.

#### Market events

As said earlier, we track and save all the market events so that they can be accessed in case the information wants to be verified, or in case someone wants to know how the latest state of a market came to be.

We implemented this as a type hierarchy, so that it's easy to query different events seamlessly. Here's the interface for the market events

```graphql
interface MarketEvent {
  id: ID!

  "Market on which this event has been triggered"
  market: Market!

  "Timestamp of the event"
  timestamp: BigInt!

  "Block on which the event was triggered"
  block: BigInt!

  "Transaction hash on which the event triggered"
  tx_hash: String!
}
```

This is the basic data that all Market events will have, but each different event will also provide specific data for the specific event. For example, the TransferMarketEvent will look like this:

```graphql
type TransferMarketEvent implements MarketEvent @entity {
  id: ID!

  market: Market!

  timestamp: BigInt!

  block: BigInt!

  tx_hash: String!

  universe: Universe!

  "Previous owner of the market"
  from: User!

  "New owner of the market"
  to: User!
}
```

It will have all the common data specified in it's interface, but will also include both `from` and `to` fields, as that's the specific data the event handles.

The different "Market events" are:
* TransferMarketEvent
* FinalizeMarketEvent
* CreateMarketEvent
* MigrateMarketEvent

Since they are implemented as a type hierarchy, they can be queried seamlessly, and any extra data for specific events can be added with [GraphQLs' inline fragments](https://graphql.org/learn/queries/#inline-fragments) to that same query. An example of this would be the following:

```graphql
marketEvents {
  id
  timestamp
  block
  tx_hash
  ... on TransferMarketEvent {
    from {
      id
    }
    to {
      id
    }
  }
}
```

With that query we will get all the market events, and for those events of type TransferMarketEvent, the `id` of `from` and `to` will be added to the response.

#### Tokens

There are different tokens to keep track on Augur, which are used for different purposes. We differentiate 4 types of tokens, which are the following:

* Dispute Tokens
* Reputation Tokens
* Participation Tokens
* Share Tokens

Each of them serves a different purpose in Augur, but we can track them almost in the same way (with the exception of ShareTokens, which have their own internal event and have to be tracked separately, more on that later).

For Reputation, Dispute and Participation tokens, we have a `Token` entity which holds the basic information of the token, like it's address (id), token type and universe.

```graphql
type Token @entity {
  id: ID!

  "Universe in which the token exists"
  universe: Universe!

  "Type of token"
  tokenType: TokenType!

  "All balance entities that use this token"
  userBalances: [UserTokenBalance!]! @derivedFrom(field: "token")
}
```

And we use a different entity to track the balance of each token that a user can have. We also used a type hierarchy, since most of their fields are the same, with the exception of some fields for the DisputeToken.

```graphql
interface UserTokenBalance {
  id: ID!

  "Universe in which this balance exists"
  universe: Universe!

  "User that owns this balance"
  user: User!

  "Token entity"
  token: Token!

  "Balance in smallest unit for the token"
  balance: BigInt!

  "Balance in atto units"
  attoBalance: BigDecimal!

  "Token events for the balance"
  events: [TokenEvent!]! @derivedFrom(field: "userTokenBalance")
}
```

In this entity we keep track of the balance of said token for a given user, along with the universe information, token information, and token events.

We have 3 differente implementations of that interface, one for each of the tokens we have to track, they are:

* UserReputationTokenBalance
* UserParticipationTokenBalance
* UserDisputeTokenBalance

#### Token events

Token events help us keep track of the different actions that resulted in the current balance, as well as keep the information from the ethereum events that triggered them.

As mentioned earlier, the ShareToken is tracked in a different way, and one of the main differences is that we can't track these token events for that specific token.

Token events are defined in a similar way to Market events, here's the interface we are using for them:

```graphql
interface TokenEvent {
  id: ID!

  "Timestamp when the event was triggered"
  timestamp: BigInt!

  "Block where the event was triggered"
  block: BigInt!

  "Transaction hash where the event triggered"
  tx_hash: String!

  "Universe where the token exists"
  universe: Universe!

  "Token which triggered the event"
  token: Token!

  "Balance that was modified by this event"
  userTokenBalance: UserTokenBalance!

  "Amount of balance modified with this event"
  amount: BigInt!
}
```

The events we track are the following:

* TokenMintedEvent
* TokenBurnedEvent
* TokenTransferredEvent

Only the `TokenTransferredEvent` has extra fields, since it needs to track the two users involved in a transfer.

We also keep both sides of the transfer (sending and receiving) as separate events, so anytime a token transfer occur, 2 entities are created and are linked with each other, so we have as much information as we can.

```graphql
type TokenTransferredEvent implements TokenEvent @entity {
  id: ID!

  timestamp: BigInt!

  block: BigInt!

  tx_hash: String!

  universe: Universe!

  token: Token!

  userTokenBalance: UserTokenBalance!

  amount: BigInt!

  "User that sent the amount of tokens specified"
  from: User!

  "User that received the amount of tokens specified"
  to: User!

  "In any transfer there will be 2 entities generated since you will have a sender and receiver. The related event is the other event generated for this transfer"
  relatedEvent: TokenTransferredEvent!

  "Depicts whether the userTokenBalance for this event is the senders' or receivers'"
  isSender: Boolean!
}
```

#### Share Token

As mentioned earlier, Share tokens are tracked different, and we have limited data regarding them, since we only count with a single event which allows to track the balance.

```graphql
type ShareToken @entity {
  id: ID!

  "Owner of the ShareToken"
  owner: User!

  "Current balance of the ShareToken"
  balance: BigInt!

  "Outcome entity that this share represents"
  outcome: Outcome!

  "Outcome internal ID"
  outcomeRaw: BigInt!

  "Market that this share is being traded on."
  market: Market!
}
```

Share tokens directly depict the balance of shares for a given market and a given outcome for that market, for that reason we track the balance, the market entity, as well as the outcome picked (both as the data that comes from the event, which is the "raw" field, and the Outcome entity)

#### Outcome

Outcomes are the different results of the underlying "Real-World" event that could possible happen. We try to have as much information for the outcomes, tracking the representation of the outcome itself, its' current payout numerator (the share of the reward when the market settles), whether or not the payout numerator is the final one and the market in which this outcome exists.

```graphql
type Outcome @entity {
  id: ID!

  market: Market!

  "String representation of the outcome"
  value: String!

  "Original bytes for the outcome of a categorical market"
  valueRaw: Bytes

  "The payout numerator for this outcome. Is available as soon as a report is done and is updated during the dispute and market finalization"
  payoutNumerator: BigInt

  "Whether the payout numerator is final"
  isFinalNumerator: Boolean!
}
```

The valueRaw can only exist for categorical markets, since they are the only market type with "custom" outcomes.

It's worth noting that during the market Reporting and Disputing, the reported outcomes are not represented as the given Outcomes, but rather as a Payout Numerator (or Payout Set) which represents the share of the winnings that each outcome should be given, since not all markets have a single outcome as a winner, and the implementation has to be able to work for all market types.

#### Dispute

The Market dispute phase is one of the most complex parts of the market lifecycle, so we decided the best way to represent this was with different entities for each of the pieces of the dispute.

The main entity is Dispute, which depicts the overview of the whole disputing process for a given Market. It includes the current MarketReport, the current DisputeRound in progress, the Market it belongs to, the Universe it belongs to, and some more data to help get the big picture of that disputing process.

```graphql
type Dispute @entity {
  id: ID!

  "Updated report for the market"
  currentReport: MarketReport!

  "Entity for the current dispute round in process"
  currentDisputeRound: DisputeRound!

  market: Market!

  universe: Universe!

  "Depicts whether the dispute is completed or not. It will be done once the market has finalized because the tentative outcome hasn't been challenged in a whole dispute window"
  isDone: Boolean!

  "List of all the dispute rounds so far"
  rounds: [DisputeRound!]! @derivedFrom(field: "dispute")

  creationTimestamp: BigInt!

  block: BigInt!

  tx_hash: String!
}
```

The dispute process in Augur starts once the first report for a Market is emitted and the first "Tentative Outcome" is made public. After that, the current "Tentative Outcome" can be disputed (or challenged) by REP holders who think that the outcome selected is not real Outcome for the "Real-World" event, and they can stake REP towards another Outcome. This is done with "DisputeCrowdsourcers" which just collect the REP staked towards a given Outcome, and if the required amount of REP is filled, then the "Tentative Outcome" is successfully disputed and the Dispute process continues in a new "Dispute Round", in which the "Tentative Outcome" for that round will be the Outcome that successfully challenged the initial report.

That same behaviour keeps happening during different "Dispute Rounds", for as long as needed to end up with a "Dispute Round" where there's no challenge achieved to the current "Tentative Outcome". In that case, the last "Tentative Outcome" is considered the Final Outcome for the Market, and the finalization and settlement of the market begins.

#### DisputeRound

The DisputeRound entity is just a simple entity that holds the information for that round, mainly the list of DisputeCrowdsourcers active on that specific round, and the market and universe information linked to that Dispute process.

```graphql
type DisputeRound @entity {
  id: ID!

  dispute: Dispute!

  market: Market!

  universe: Universe!

  "List of all the dispute crowdsourcers active for this round"
  crowdsourcers: [DisputeCrowdsourcer!]! @derivedFrom(field: "disputeRound")
}
```

#### DisputeCrowdsourcer

The DisputeCrowdsourcer entity tracks the state of the crowdsourcers on a given DisputeRound.

```graphql
type DisputeCrowdsourcer @entity {
  id: ID!

  market: Market!

  universe: Universe!

  "Payout numerators depict all the outcomes and their respective 'share' of the winnings based on the numTick of the market"
  payoutNumerators: [BigInt!]!

  "Amount of attoREP staked"
  staked: BigInt!

  "Amount of attoREP needed for the dispute bond to be filled and challenge/dispute the current tentative report"
  disputeBondSize: BigInt!

  "Whether the bond has been filled or not"
  bondFilled: Boolean!

  disputeRound: DisputeRound!
}
```

It holds data such as the payoutNumerators for the crowdsourcer, which representes the Outcome for the market, as stated earlier, the amount of REP staked towards that Outcome, the amount of REP needed to fill the dispute bond and successfully dispute the Tentative Outcome, and whether or not this bond has been filled.

#### Augur metadata

We also added some entities to track some events that are related to some global internal data for augur, such as deployment data and different internal contracts. The entities responsible for this are `Augur` and `Contract`.

#### Time-travel queries

TheGraph allows for queries to receive a block number parameter, which in turns makes that query result to represent the state aggregated until that block number, effectively allowing to query for the state of entities in that given block number.

This behaviour allows some interesting use cases. For more info on "Time-Travel" queries, visit [this article by the Blocklytics team!](https://blocklytics.org/blog/ethereum-blocks-subgraph-made-for-time-travel/)
