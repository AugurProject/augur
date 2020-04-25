[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/ContractEvents"](../modules/_augur_sdk_src_api_contractevents_.md) › [ContractEvents](_augur_sdk_src_api_contractevents_.contractevents.md)

# Class: ContractEvents

## Hierarchy

* **ContractEvents**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_contractevents_.contractevents.md#constructor)

### Properties

* [augurAddress](_augur_sdk_src_api_contractevents_.contractevents.md#private-auguraddress)
* [augurTradingAddress](_augur_sdk_src_api_contractevents_.contractevents.md#private-augurtradingaddress)
* [contractAddressToName](_augur_sdk_src_api_contractevents_.contractevents.md#private-contractaddresstoname)
* [provider](_augur_sdk_src_api_contractevents_.contractevents.md#private-provider)
* [shareTokenAddress](_augur_sdk_src_api_contractevents_.contractevents.md#private-sharetokenaddress)

### Methods

* [getAugurContractAddresses](_augur_sdk_src_api_contractevents_.contractevents.md#getaugurcontractaddresses)
* [getEventContractAddress](_augur_sdk_src_api_contractevents_.contractevents.md#geteventcontractaddress)
* [getEventContractName](_augur_sdk_src_api_contractevents_.contractevents.md#geteventcontractname)
* [getEventTopics](_augur_sdk_src_api_contractevents_.contractevents.md#geteventtopics)
* [parseLogs](_augur_sdk_src_api_contractevents_.contractevents.md#parselogs)

### Object literals

* [eventNameToContractName](_augur_sdk_src_api_contractevents_.contractevents.md#private-eventnametocontractname)

## Constructors

###  constructor

\+ **new ContractEvents**(`provider`: [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md), `augurAddress`: string, `augurTradingAddress`: string, `shareTokenAddress`: string): *[ContractEvents](_augur_sdk_src_api_contractevents_.contractevents.md)*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md) |
`augurAddress` | string |
`augurTradingAddress` | string |
`shareTokenAddress` | string |

**Returns:** *[ContractEvents](_augur_sdk_src_api_contractevents_.contractevents.md)*

## Properties

### `Private` augurAddress

• **augurAddress**: *string*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L19)*

___

### `Private` augurTradingAddress

• **augurTradingAddress**: *string*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L20)*

___

### `Private` contractAddressToName

• **contractAddressToName**: *object*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L15)*

#### Type declaration:

___

### `Private` provider

• **provider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L18)*

___

### `Private` shareTokenAddress

• **shareTokenAddress**: *string*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L21)*

## Methods

###  getAugurContractAddresses

▸ **getAugurContractAddresses**(): *string[]*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:39](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L39)*

**Returns:** *string[]*

___

###  getEventContractAddress

▸ **getEventContractAddress**(`eventName`: string): *string*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:47](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

**Returns:** *string*

___

###  getEventContractName

▸ **getEventContractName**(`eventName`: string): *any*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:34](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

**Returns:** *any*

___

###  getEventTopics

▸ **getEventTopics**(`eventName`: string): *string[]*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:54](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

**Returns:** *string[]*

___

###  parseLogs

▸ **parseLogs**(`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:58](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

## Object literals

### `Private` eventNameToContractName

### ▪ **eventNameToContractName**: *object*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:6](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L6)*

###  CancelZeroXOrder

• **CancelZeroXOrder**: *string* = "AugurTrading"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L12)*

###  MarketVolumeChanged

• **MarketVolumeChanged**: *string* = "AugurTrading"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L11)*

###  OrderEvent

• **OrderEvent**: *string* = "AugurTrading"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:9](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L9)*

###  ProfitLossChanged

• **ProfitLossChanged**: *string* = "AugurTrading"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:10](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L10)*

###  TransferBatch

• **TransferBatch**: *string* = "ShareToken"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:8](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L8)*

###  TransferSingle

• **TransferSingle**: *string* = "ShareToken"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:7](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ContractEvents.ts#L7)*
