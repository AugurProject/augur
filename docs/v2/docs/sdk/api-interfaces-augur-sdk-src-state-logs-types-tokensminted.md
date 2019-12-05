---
id: api-interfaces-augur-sdk-src-state-logs-types-tokensminted
title: TokensMinted
sidebar_label: TokensMinted
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [TokensMinted](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md)

## Interface

## Hierarchy

 [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

**↳ TokensMinted**

### Properties

* [amount](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#amount)
* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#blocknumber)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#market)
* [target](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#target)
* [token](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#token)
* [tokenType](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#tokentype)
* [totalSupply](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#totalsupply)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md#universe)

---

## Properties

<a id="amount"></a>

###  amount

**● amount**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:337](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L337)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L21)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L24)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:339](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L339)*

___
<a id="target"></a>

###  target

**● target**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:336](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L336)*

___
<a id="token"></a>

###  token

**● token**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:335](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L335)*

___
<a id="tokentype"></a>

###  tokenType

**● tokenType**: *[TokenType](api-enums-augur-sdk-src-state-logs-types-tokentype.md)*

*Defined in [augur-sdk/src/state/logs/types.ts:338](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L338)*

___
<a id="totalsupply"></a>

###  totalSupply

**● totalSupply**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:340](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L340)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L23)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L22)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:334](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L334)*

___

