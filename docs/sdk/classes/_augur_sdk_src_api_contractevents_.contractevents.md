[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/ContractEvents"](../modules/_augur_sdk_src_api_contractevents_.md) › [ContractEvents](_augur_sdk_src_api_contractevents_.contractevents.md)

# Class: ContractEvents

## Hierarchy

* **ContractEvents**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_contractevents_.contractevents.md#constructor)

### Properties

* [augurAddress](_augur_sdk_src_api_contractevents_.contractevents.md#private-readonly-auguraddress)
* [augurTradingAddress](_augur_sdk_src_api_contractevents_.contractevents.md#private-readonly-augurtradingaddress)
* [contractAddressToName](_augur_sdk_src_api_contractevents_.contractevents.md#private-readonly-contractaddresstoname)
* [provider](_augur_sdk_src_api_contractevents_.contractevents.md#private-readonly-provider)
* [shareTokenAddress](_augur_sdk_src_api_contractevents_.contractevents.md#private-readonly-sharetokenaddress)

### Methods

* [getAugurContractAddresses](_augur_sdk_src_api_contractevents_.contractevents.md#getaugurcontractaddresses)
* [getEventContractAddress](_augur_sdk_src_api_contractevents_.contractevents.md#geteventcontractaddress)
* [getEventContractName](_augur_sdk_src_api_contractevents_.contractevents.md#geteventcontractname)
* [getEventTopics](_augur_sdk_src_api_contractevents_.contractevents.md#geteventtopics)
* [parseLogs](_augur_sdk_src_api_contractevents_.contractevents.md#parselogs)

### Object literals

* [eventNameToContractName](_augur_sdk_src_api_contractevents_.contractevents.md#private-readonly-eventnametocontractname)

## Constructors

###  constructor

\+ **new ContractEvents**(`provider`: [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md), `augurAddress`: string, `augurTradingAddress`: string, `shareTokenAddress`: string): *[ContractEvents](_augur_sdk_src_api_contractevents_.contractevents.md)*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md) |
`augurAddress` | string |
`augurTradingAddress` | string |
`shareTokenAddress` | string |

**Returns:** *[ContractEvents](_augur_sdk_src_api_contractevents_.contractevents.md)*

## Properties

### `Private` `Readonly` augurAddress

• **augurAddress**: *string*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:20](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L20)*

___

### `Private` `Readonly` augurTradingAddress

• **augurTradingAddress**: *string*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L21)*

___

### `Private` `Readonly` contractAddressToName

• **contractAddressToName**: *object*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L16)*

#### Type declaration:

___

### `Private` `Readonly` provider

• **provider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:19](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L19)*

___

### `Private` `Readonly` shareTokenAddress

• **shareTokenAddress**: *string*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:22](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L22)*

## Methods

###  getAugurContractAddresses

▸ **getAugurContractAddresses**(): *string[]*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:40](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L40)*

**Returns:** *string[]*

___

###  getEventContractAddress

▸ **getEventContractAddress**(`eventName`: string): *string*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:48](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

**Returns:** *string*

___

###  getEventContractName

▸ **getEventContractName**(`eventName`: string): *any*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:35](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

**Returns:** *any*

___

###  getEventTopics

▸ **getEventTopics**(`eventName`: string): *string[]*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:55](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

**Returns:** *string[]*

___

###  parseLogs

▸ **parseLogs**(`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:59](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

## Object literals

### `Private` `Readonly` eventNameToContractName

### ▪ **eventNameToContractName**: *object*

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:7](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L7)*

###  CancelZeroXOrder

• **CancelZeroXOrder**: *string* = "AugurTrading"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:13](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L13)*

###  MarketVolumeChanged

• **MarketVolumeChanged**: *string* = "AugurTrading"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:12](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L12)*

###  OrderEvent

• **OrderEvent**: *string* = "AugurTrading"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:10](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L10)*

###  ProfitLossChanged

• **ProfitLossChanged**: *string* = "AugurTrading"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:11](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L11)*

###  TransferBatch

• **TransferBatch**: *string* = "ShareToken"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:9](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L9)*

###  TransferSingle

• **TransferSingle**: *string* = "ShareToken"

*Defined in [packages/augur-sdk/src/api/ContractEvents.ts:8](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ContractEvents.ts#L8)*
