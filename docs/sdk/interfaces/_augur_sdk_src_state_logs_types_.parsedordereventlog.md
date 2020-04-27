[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/types"](../modules/_augur_sdk_src_state_logs_types_.md) › [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md)

# Interface: ParsedOrderEventLog

## Hierarchy

  ↳ [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md)

  ↳ **ParsedOrderEventLog**

  ↳ [CurrentOrder](_augur_sdk_src_state_logs_types_.currentorder.md)

## Index

### Properties

* [amount](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#amount)
* [amountFilled](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#amountfilled)
* [blockHash](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#blockhash)
* [blockNumber](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#blocknumber)
* [eventType](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#eventtype)
* [fees](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#fees)
* [logIndex](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#logindex)
* [market](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#market)
* [orderCreator](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#ordercreator)
* [orderFiller](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#orderfiller)
* [orderId](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#orderid)
* [orderType](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#ordertype)
* [outcome](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#outcome)
* [price](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#price)
* [sharesEscrowed](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#sharesescrowed)
* [sharesRefund](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#sharesrefund)
* [timestamp](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#timestamp)
* [tokenRefund](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#tokenrefund)
* [tokensEscrowed](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#tokensescrowed)
* [tradeGroupId](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#tradegroupid)
* [transactionHash](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#transactionhash)
* [transactionIndex](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#transactionindex)
* [universe](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#universe)

## Properties

###  amount

• **amount**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:234](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L234)*

___

###  amountFilled

• **amountFilled**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:239](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L239)*

___

###  blockHash

• **blockHash**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[blockHash](_augur_sdk_src_state_logs_types_.log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L18)*

___

###  blockNumber

• **blockNumber**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[blockNumber](_augur_sdk_src_state_logs_types_.log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L17)*

___

###  eventType

• **eventType**: *[OrderEventType](../enums/_augur_sdk_src_state_logs_types_.ordereventtype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:227](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L227)*

___

###  fees

• **fees**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:238](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L238)*

___

###  logIndex

• **logIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[logIndex](_augur_sdk_src_state_logs_types_.log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L21)*

___

###  market

• **market**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:226](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L226)*

___

###  orderCreator

• **orderCreator**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:231](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L231)*

___

###  orderFiller

• **orderFiller**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:232](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L232)*

___

###  orderId

• **orderId**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:229](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L229)*

___

###  orderType

• **orderType**: *[OrderType](../enums/_augur_sdk_src_state_logs_types_.ordertype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:228](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L228)*

___

###  outcome

• **outcome**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:235](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L235)*

___

###  price

• **price**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:233](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L233)*

___

###  sharesEscrowed

• **sharesEscrowed**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:241](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L241)*

___

###  sharesRefund

• **sharesRefund**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:237](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L237)*

___

###  timestamp

• **timestamp**: *string*

*Overrides [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md).[timestamp](_augur_sdk_src_state_logs_types_.timestampedlog.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:240](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L240)*

___

###  tokenRefund

• **tokenRefund**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:236](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L236)*

___

###  tokensEscrowed

• **tokensEscrowed**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:242](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L242)*

___

###  tradeGroupId

• **tradeGroupId**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:230](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L230)*

___

###  transactionHash

• **transactionHash**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[transactionHash](_augur_sdk_src_state_logs_types_.log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L20)*

___

###  transactionIndex

• **transactionIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[transactionIndex](_augur_sdk_src_state_logs_types_.log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L19)*

___

###  universe

• **universe**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:225](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L225)*
