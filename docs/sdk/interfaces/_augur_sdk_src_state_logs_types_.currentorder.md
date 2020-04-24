[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/types"](../modules/_augur_sdk_src_state_logs_types_.md) › [CurrentOrder](_augur_sdk_src_state_logs_types_.currentorder.md)

# Interface: CurrentOrder

## Hierarchy

  ↳ [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md)

  ↳ **CurrentOrder**

## Index

### Properties

* [amount](_augur_sdk_src_state_logs_types_.currentorder.md#amount)
* [amountFilled](_augur_sdk_src_state_logs_types_.currentorder.md#amountfilled)
* [blockHash](_augur_sdk_src_state_logs_types_.currentorder.md#blockhash)
* [blockNumber](_augur_sdk_src_state_logs_types_.currentorder.md#blocknumber)
* [eventType](_augur_sdk_src_state_logs_types_.currentorder.md#eventtype)
* [fees](_augur_sdk_src_state_logs_types_.currentorder.md#fees)
* [logIndex](_augur_sdk_src_state_logs_types_.currentorder.md#logindex)
* [market](_augur_sdk_src_state_logs_types_.currentorder.md#market)
* [open](_augur_sdk_src_state_logs_types_.currentorder.md#open)
* [orderCreator](_augur_sdk_src_state_logs_types_.currentorder.md#ordercreator)
* [orderFiller](_augur_sdk_src_state_logs_types_.currentorder.md#orderfiller)
* [orderId](_augur_sdk_src_state_logs_types_.currentorder.md#orderid)
* [orderType](_augur_sdk_src_state_logs_types_.currentorder.md#ordertype)
* [outcome](_augur_sdk_src_state_logs_types_.currentorder.md#outcome)
* [price](_augur_sdk_src_state_logs_types_.currentorder.md#price)
* [sharesEscrowed](_augur_sdk_src_state_logs_types_.currentorder.md#sharesescrowed)
* [sharesRefund](_augur_sdk_src_state_logs_types_.currentorder.md#sharesrefund)
* [timestamp](_augur_sdk_src_state_logs_types_.currentorder.md#timestamp)
* [tokenRefund](_augur_sdk_src_state_logs_types_.currentorder.md#tokenrefund)
* [tokensEscrowed](_augur_sdk_src_state_logs_types_.currentorder.md#tokensescrowed)
* [tradeGroupId](_augur_sdk_src_state_logs_types_.currentorder.md#tradegroupid)
* [transactionHash](_augur_sdk_src_state_logs_types_.currentorder.md#transactionhash)
* [transactionIndex](_augur_sdk_src_state_logs_types_.currentorder.md#transactionindex)
* [universe](_augur_sdk_src_state_logs_types_.currentorder.md#universe)

## Properties

###  amount

• **amount**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[amount](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#amount)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:234](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L234)*

___

###  amountFilled

• **amountFilled**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[amountFilled](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#amountfilled)*

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

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[eventType](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#eventtype)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:227](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L227)*

___

###  fees

• **fees**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[fees](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#fees)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:238](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L238)*

___

###  logIndex

• **logIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[logIndex](_augur_sdk_src_state_logs_types_.log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L21)*

___

###  market

• **market**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[market](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#market)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:226](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L226)*

___

###  open

• **open**: *number*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:246](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L246)*

___

###  orderCreator

• **orderCreator**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[orderCreator](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#ordercreator)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:231](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L231)*

___

###  orderFiller

• **orderFiller**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[orderFiller](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#orderfiller)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:232](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L232)*

___

###  orderId

• **orderId**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[orderId](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#orderid)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:229](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L229)*

___

###  orderType

• **orderType**: *[OrderType](../enums/_augur_sdk_src_state_logs_types_.ordertype.md)*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[orderType](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#ordertype)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:228](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L228)*

___

###  outcome

• **outcome**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[outcome](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#outcome)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:235](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L235)*

___

###  price

• **price**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[price](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#price)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:233](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L233)*

___

###  sharesEscrowed

• **sharesEscrowed**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[sharesEscrowed](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#sharesescrowed)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:241](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L241)*

___

###  sharesRefund

• **sharesRefund**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[sharesRefund](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#sharesrefund)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:237](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L237)*

___

###  timestamp

• **timestamp**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[timestamp](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#timestamp)*

*Overrides [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md).[timestamp](_augur_sdk_src_state_logs_types_.timestampedlog.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:240](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L240)*

___

###  tokenRefund

• **tokenRefund**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[tokenRefund](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#tokenrefund)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:236](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L236)*

___

###  tokensEscrowed

• **tokensEscrowed**: *string*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[tokensEscrowed](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#tokensescrowed)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:242](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L242)*

___

###  tradeGroupId

• **tradeGroupId**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[tradeGroupId](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#tradegroupid)*

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

*Inherited from [ParsedOrderEventLog](_augur_sdk_src_state_logs_types_.parsedordereventlog.md).[universe](_augur_sdk_src_state_logs_types_.parsedordereventlog.md#universe)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:225](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L225)*
