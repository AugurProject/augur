# Augur Trading on L2 Specification

## Goal
The security of the Augur v2 Oracle was designed to be independent of trading, so long as sufficient trading fees can be extracted such that the total REP market cap grows to be able to maintain security of the oracle via Augur's forking mechanism. Because of this design decision it is possible to moving Augur v2 Trading off of Layer 1 (ethereum) and on to any other plaform under the constrain that the assets used for trading must be locked up on ethereum when participating.

Also, since releasing Augur v2, work has been done to implement support for multiple collateral types in Augur. This feature is referred to as "ParaAugur", meaning Parallel Augur. This implementation allows multiple trading implementations, collateralized in arbitrary tokens, to pool their Open Interest such that the security guarantees above remain true. This opens the opportunity for side-chains to interact with a specific collateralization of Augur depending on their use case, and also opens to the door to contract modifications which make side chain support cleaner.

We will be defining a specification for what a Layer 2 (or sidechain) needs to implement in order to fully support augur trading on that chain. This will require bridging, potentially some contract code implemented for Ethereum, and the ability to access certain data on the sidechain.

## Para Architecture

Architecture Diagram.

### Overview
Each collateral for which trading is enabled will have the set of contracts deployed to Layer 1 which exist in the [`para` folder of the Augur Monorepo](https://github.com/AugurProject/augur/tree/para_deploys/packages/augur-core/src/contracts/para). These contracts are deployed via a factory to ensure that all collaterals are deployed with the exact same set of contracts -- which eases verifiability.

Sidechain deployments consist of a deployment onto Layer 2 of the contracts in the [`sidechain` folder of the Augur Monorepo](https://github.com/AugurProject/augur/tree/para_deploys/packages/augur-core/src/contracts/sidechain). The intention is that for each Para deploy that needs to exist on a sidechain, a separate deployment of any bridging logic, as well as sidechain contracts will be deployed.

### Markets
Markets are defined on the core Augur V2 deploy and are shared by all Para Augur instances. During the market lifecycle it will be necessary to bridge the following data to any side chain deployments: Market Creation, Market Finalization, and Market Migration to a Child Universe.

This market data will be exposed on L2 by a contract which adheres to the [`IMarketGetter` interface](https://github.com/AugurProject/augur/blob/para_deploys/packages/augur-core/src/contracts/sidechain/IMarketGetter.sol). When deploying the sidechain contracts, it will be necessary to specify:

- The contract which implements IMarketGetter
- The sidechain collateral token (this is a generic ERC-20 in which people will trade on the sidechain, minted specifically for Augur).
- An address where fees will be extracted during trading, which will ultimately be exited to Layer1 for collection by REP holders.

### Reporting and Forking
Reporting and Forking occur on the core Augur V2 deploy and are not a part of the Para Deploy. This means that all Augur Oracle functionality stays on Layer 1. The only data that is required to be bridged is the Reporting Fee (discussed later in "OINexus") and markets as they're migrated to a new child unverse after a fork.

### Trading
Para Augur consists of a new set of trading contracts, collateralized in an ERC-20 token, which will be deployed via on on-chain factory. Para Augur deploys do not have to relate to side chains: they can be for Layer 1 collateral. For those that do relate to sidechains, each will require an independent bridge to that sidechain.

### OINexus and Fee Calculations
The OINexus is a single contract that is deployed for all of the Para Augurs. During the operation of each Para Augur, trading fees are extracted during trading, and are sent the Para-Augur's "FeePot" contract. As trading occurs, or as collateral is locked in a ParaOICash contracts, the total Open Interest in each Para Augur is tracked and reported back to the OINexus contract. The OINexus calculates a total reporting fee based upon the total OI across all Augur instances. This reporting fee changes at most every three days, and this value must be available to any sidechain deployments as it is used when extracting trading fees on the side chain.


## L1 Data Availability on L2

In order for the sidechain Augur to work, certain data must be accessible on Layer 2 from Layer 1, and occassionally some assets must be able to be transferred from Layer 2 back to Layer 1. These fall into the the categories of User Assets, Market Data, and Fees.

### User Assets

Users wanting to trade on a Sidechain deployment of Augur need to move assets onto the sidechain, and at the same time the Augur oracle has a requirement that it able to account for all Open Interest across all platforms. To solve this problem we employ the OICash contract. Collateral will be deposited into OICash by a user. When assets are deposited in OICash, they must also be bridged over to the Layer 2. Whence on Layer 2, these assets should be made available to the user to trade on Augur.

#### Bridge via Push
These balances should be migrated similarly to any ERC-20. When a user deposits into the collateral ParaOICash it will mint ParaOICash tokens which can be deposited into your sidechain's deposit contracts.

#### Bridge via Events
Assets must be locked on Layer 1 and made available on Layer 2.

### Market Data

Market Data must be made available on Layer 2 when markets are Created, Finalized, or Migrated to a new universe after a successful Fork.

The data that must be bridged over is:
- owner
- numOutcomes
- affiliateFeeDivisor
- feeDivisor
- numTicks
- universe
- finalized
- winningPayout

#### Bridge via Push

The `bridgeMarket` function on [AugurPushBridge.sol](https://github.com/AugurProject/augur/blob/para_deploys/packages/augur-core/src/contracts/sidechain/AugurPushBridge.sol#L12) will return a struct with all the data needed for Layer 2. To integrate with the Augur UI, wrapper contracts will need to be integrated with the UI to make sure these events are called in the appropriate place(s). This is yet to be implemented.

#### Bridge via Events
If data can be made accessible by proving the existence of Ethereum Events, the data can be retrieved via the following events, all emitted from the `ParaAugur` contract instance for the deployed collateral.
##### MarketCreated
- owner
- numOutcomes
- affiliateFeeDivisor
- feeDivisor
- numTicks
- universe
##### MarketFinalized
- finalized (true, if this event was emitted)
- winningPayout
##### MarketMigrated
- newUniverse

### Fee Data

In the course of normal operation of Augur, the fee rate needed for Oracle security is adjusted at most every three days. This data must be available on L2 so that trading on L2 can extrac the appropriate fees. There is no need for this adjustment to be immediate and any normal delays in making the data available on L2 are acceptable.

#### Bridge via Push
he `bridgeReportingFee` function on [AugurPushBridge.sol](https://github.com/AugurProject/augur/blob/para_deploys/packages/augur-core/src/contracts/sidechain/AugurPushBridge.sol#L28) will return a uint256 with all the data needed for Layer 2.

#### Bridge via Event

There is a single event, emitted from the [ParaAugur](https://github.com/AugurProject/augur/blob/para_deploys/packages/augur-core/src/contracts/para/ParaAugur.sol#L27) instance for the collateral.

##### ReportingFeeChanged
- universe -- the universe for this deploy
- reportingFee -- The current reporting fee for the uinverse
- para -- The ShareToken address of the parallel augur deploy.

### How to Develop with Para Augur

#### File Layout

#### Deployment (Local)

To develop connected to Para Augur it is most efficient to use a local ethereum instance with the various contracts deployed. Augur has default Geth docker images which can be used to quickly spin up a node that has ETH allocated to development private keys, which can be spun up with `yarn` scripts from the root of the monorepo.

Deploying the contracts for local development involes using the Augur command line tool `flash` which is available from the root of monorepo using the command `yarn flash`. `flash` has a huge variety of tools available for working with Augur instances, in this case we will use it to deploy the base Augur contracts, deploy the Para Augur Factory, and then to use that Factory to deploy an Augur instance collateralized in the currency of our choosing.


#### Deployment (Remote)
