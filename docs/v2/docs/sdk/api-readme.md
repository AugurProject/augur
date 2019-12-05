---
id: api-readme
title: @augurproject/sdk
sidebar_label: @augurproject/sdk
---

[

Augur SDK
=========

](#augur-sdk)

Augur SDK Sycning and Querying Utilities

To run in the browser

```sh
$ yarn webpack-dev-server
```

Then visit [http://localhost:8080](http://localhost:8080)

### External modules

* [[augur-sdk/src/Augur Module]](api-modules-augur-sdk-src-augur-module.md)
* [[augur-sdk/src/api/Contracts Module]](api-modules-augur-sdk-src-api-contracts-module.md)
* [[augur-sdk/src/api/Events Module]](api-modules-augur-sdk-src-api-events-module.md)
* [[augur-sdk/src/api/Events.test Module]](api-modules-augur-sdk-src-api-events-test-module.md)
* [[augur-sdk/src/api/Gnosis Module]](api-modules-augur-sdk-src-api-gnosis-module.md)
* [[augur-sdk/src/api/HotLoading Module]](api-modules-augur-sdk-src-api-hotloading-module.md)
* [[augur-sdk/src/api/Liquidity Module]](api-modules-augur-sdk-src-api-liquidity-module.md)
* [[augur-sdk/src/api/Market Module]](api-modules-augur-sdk-src-api-market-module.md)
* [[augur-sdk/src/api/OnChainTrade Module]](api-modules-augur-sdk-src-api-onchaintrade-module.md)
* [[augur-sdk/src/api/Trade Module]](api-modules-augur-sdk-src-api-trade-module.md)
* [[augur-sdk/src/api/ZeroX Module]](api-modules-augur-sdk-src-api-zerox-module.md)
* [[augur-sdk/src/connector/baseConnector Module]](api-modules-augur-sdk-src-connector-baseconnector-module.md)
* [[augur-sdk/src/connector/direct-connector Module]](api-modules-augur-sdk-src-connector-direct-connector-module.md)
* [[augur-sdk/src/connector/empty-connector Module]](api-modules-augur-sdk-src-connector-empty-connector-module.md)
* [[augur-sdk/src/connector/http-connector Module]](api-modules-augur-sdk-src-connector-http-connector-module.md)
* [[augur-sdk/src/connector/http-connector.test Module]](api-modules-augur-sdk-src-connector-http-connector-test-module.md)
* [[augur-sdk/src/connector/index Module]](api-modules-augur-sdk-src-connector-index-module.md)
* [[augur-sdk/src/connector/seo-connector Module]](api-modules-augur-sdk-src-connector-seo-connector-module.md)
* [[augur-sdk/src/connector/single-thread-connector Module]](api-modules-augur-sdk-src-connector-single-thread-connector-module.md)
* [[augur-sdk/src/connector/ws-connector Module]](api-modules-augur-sdk-src-connector-ws-connector-module.md)
* [[augur-sdk/src/constants Module]](api-modules-augur-sdk-src-constants-module.md)
* [[augur-sdk/src/ethereum/Provider Module]](api-modules-augur-sdk-src-ethereum-provider-module.md)
* [[augur-sdk/src/event-handlers Module]](api-modules-augur-sdk-src-event-handlers-module.md)
* [[augur-sdk/src/events Module]](api-modules-augur-sdk-src-events-module.md)
* [[augur-sdk/src/index Module]](api-modules-augur-sdk-src-index-module.md)
* [[augur-sdk/src/state/AddressFormatReviver Module]](api-modules-augur-sdk-src-state-addressformatreviver-module.md)
* [[augur-sdk/src/state/Controller Module]](api-modules-augur-sdk-src-state-controller-module.md)
* [[augur-sdk/src/state/HTTPEndpoint Module]](api-modules-augur-sdk-src-state-httpendpoint-module.md)
* [[augur-sdk/src/state/IsJsonRpcRequest Module]](api-modules-augur-sdk-src-state-isjsonrpcrequest-module.md)
* [[augur-sdk/src/state/MakeJsonRpcError Module]](api-modules-augur-sdk-src-state-makejsonrpcerror-module.md)
* [[augur-sdk/src/state/MakeJsonRpcResponse Module]](api-modules-augur-sdk-src-state-makejsonrpcresponse-module.md)
* [[augur-sdk/src/state/Server Module]](api-modules-augur-sdk-src-state-server-module.md)
* [[augur-sdk/src/state/Sync Module]](api-modules-augur-sdk-src-state-sync-module.md)
* [[augur-sdk/src/state/WebsocketEndpoint Module]](api-modules-augur-sdk-src-state-websocketendpoint-module.md)
* [[augur-sdk/src/state/create-api Module]](api-modules-augur-sdk-src-state-create-api-module.md)
* [[augur-sdk/src/state/db/AbstractTable Module]](api-modules-augur-sdk-src-state-db-abstracttable-module.md)
* [[augur-sdk/src/state/db/BlockAndLogStreamListener.test Module]](api-modules-augur-sdk-src-state-db-blockandlogstreamlistener-test-module.md)
* [[augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md)
* [[augur-sdk/src/state/db/CurrentOrdersDB Module]](api-modules-augur-sdk-src-state-db-currentordersdb-module.md)
* [[augur-sdk/src/state/db/DB Module]](api-modules-augur-sdk-src-state-db-db-module.md)
* [[augur-sdk/src/state/db/DerivedDB Module]](api-modules-augur-sdk-src-state-db-deriveddb-module.md)
* [[augur-sdk/src/state/db/DisputeDB Module]](api-modules-augur-sdk-src-state-db-disputedb-module.md)
* [[augur-sdk/src/state/db/LiquidityDB Module]](api-modules-augur-sdk-src-state-db-liquiditydb-module.md)
* [[augur-sdk/src/state/db/MarketDB Module]](api-modules-augur-sdk-src-state-db-marketdb-module.md)
* [[augur-sdk/src/state/db/RollbackTable Module]](api-modules-augur-sdk-src-state-db-rollbacktable-module.md)
* [[augur-sdk/src/state/db/SyncStatus Module]](api-modules-augur-sdk-src-state-db-syncstatus-module.md)
* [[augur-sdk/src/state/db/SyncableDB Module]](api-modules-augur-sdk-src-state-db-syncabledb-module.md)
* [[augur-sdk/src/state/db/SyncableFlexSearch Module]](api-modules-augur-sdk-src-state-db-syncableflexsearch-module.md)
* [[augur-sdk/src/state/db/ZeroXOrders Module]](api-modules-augur-sdk-src-state-db-zeroxorders-module.md)
* [[augur-sdk/src/state/getter/API Module]](api-modules-augur-sdk-src-state-getter-api-module.md)
* [[augur-sdk/src/state/getter/Accounts Module]](api-modules-augur-sdk-src-state-getter-accounts-module.md)
* [[augur-sdk/src/state/getter/Liquidity Module]](api-modules-augur-sdk-src-state-getter-liquidity-module.md)
* [[augur-sdk/src/state/getter/Markets Module]](api-modules-augur-sdk-src-state-getter-markets-module.md)
* [[augur-sdk/src/state/getter/OnChainTrading Module]](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md)
* [[augur-sdk/src/state/getter/Ping Module]](api-modules-augur-sdk-src-state-getter-ping-module.md)
* [[augur-sdk/src/state/getter/Platform Module]](api-modules-augur-sdk-src-state-getter-platform-module.md)
* [[augur-sdk/src/state/getter/Router Module]](api-modules-augur-sdk-src-state-getter-router-module.md)
* [[augur-sdk/src/state/getter/Universe Module]](api-modules-augur-sdk-src-state-getter-universe-module.md)
* [[augur-sdk/src/state/getter/Users Module]](api-modules-augur-sdk-src-state-getter-users-module.md)
* [[augur-sdk/src/state/getter/ZeroXOrdersGetters Module]](api-modules-augur-sdk-src-state-getter-zeroxordersgetters-module.md)
* [[augur-sdk/src/state/getter/index Module]](api-modules-augur-sdk-src-state-getter-index-module.md)
* [[augur-sdk/src/state/getter/status Module]](api-modules-augur-sdk-src-state-getter-status-module.md)
* [[augur-sdk/src/state/getter/types Module]](api-modules-augur-sdk-src-state-getter-types-module.md)
* [[augur-sdk/src/state/index Module]](api-modules-augur-sdk-src-state-index-module.md)
* [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md)
* [[augur-sdk/src/state/server/ServerController Module]](api-modules-augur-sdk-src-state-server-servercontroller-module.md)
* [[augur-sdk/src/state/test-connector Module]](api-modules-augur-sdk-src-state-test-connector-module.md)
* [[augur-sdk/src/state/utils/DexieIDBShim Module]](api-modules-augur-sdk-src-state-utils-dexieidbshim-module.md)
* [[augur-sdk/src/state/utils/logger/StandardLogger Module]](api-modules-augur-sdk-src-state-utils-logger-standardlogger-module.md)
* [[augur-sdk/src/state/utils/logger/index Module]](api-modules-augur-sdk-src-state-utils-logger-index-module.md)
* [[augur-sdk/src/state/utils/logger/logger Module]](api-modules-augur-sdk-src-state-utils-logger-logger-module.md)
* [[augur-sdk/src/state/utils/utils Module]](api-modules-augur-sdk-src-state-utils-utils-module.md)
* [[augur-sdk/src/subscriptions Module]](api-modules-augur-sdk-src-subscriptions-module.md)
* [[augur-sdk/src/utils Module]](api-modules-augur-sdk-src-utils-module.md)
* [[augur-sdk/src/utils.test Module]](api-modules-augur-sdk-src-utils-test-module.md)
* [[augur-sdk/src/zeroX/ProviderSubprovider Module]](api-modules-augur-sdk-src-zerox-providersubprovider-module.md)
* [[augur-sdk/src/zeroX/SignerSubprovider Module]](api-modules-augur-sdk-src-zerox-signersubprovider-module.md)
* [[augur-types/types/events Module]](api-modules-augur-types-types-events-module.md)
* [[augur-types/types/index Module]](api-modules-augur-types-types-index-module.md)
* [[augur-types/types/logs Module]](api-modules-augur-types-types-logs-module.md)

---

