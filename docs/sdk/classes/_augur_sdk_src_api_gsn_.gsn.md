[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/GSN"](../modules/_augur_sdk_src_api_gsn_.md) › [GSN](_augur_sdk_src_api_gsn_.gsn.md)

# Class: GSN

## Hierarchy

* **GSN**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_gsn_.gsn.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_gsn_.gsn.md#private-augur)
* [provider](_augur_sdk_src_api_gsn_.gsn.md#private-provider)
* [walletAddresses](_augur_sdk_src_api_gsn_.gsn.md#walletaddresses)

### Methods

* [calculateWalletAddress](_augur_sdk_src_api_gsn_.gsn.md#calculatewalletaddress)
* [initializeWallet](_augur_sdk_src_api_gsn_.gsn.md#initializewallet)
* [userHasInitializedWallet](_augur_sdk_src_api_gsn_.gsn.md#userhasinitializedwallet)
* [withdrawAllFunds](_augur_sdk_src_api_gsn_.gsn.md#withdrawallfunds)
* [withdrawAllFundsEstimateGas](_augur_sdk_src_api_gsn_.gsn.md#withdrawallfundsestimategas)

## Constructors

###  constructor

\+ **new GSN**(`provider`: [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md), `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[GSN](_augur_sdk_src_api_gsn_.gsn.md)*

*Defined in [packages/augur-sdk/src/api/GSN.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md) |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[GSN](_augur_sdk_src_api_gsn_.gsn.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/GSN.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L16)*

___

### `Private` provider

• **provider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

*Defined in [packages/augur-sdk/src/api/GSN.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L15)*

___

###  walletAddresses

• **walletAddresses**: *object*

*Defined in [packages/augur-sdk/src/api/GSN.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L12)*

#### Type declaration:

* \[ **key**: *string*\]: string

## Methods

###  calculateWalletAddress

▸ **calculateWalletAddress**(`owner`: string): *Promise‹string›*

*Defined in [packages/augur-sdk/src/api/GSN.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L27)*

**`desc`** Calculates the wallet address for a user

**Parameters:**

Name | Type |
------ | ------ |
`owner` | string |

**Returns:** *Promise‹string›*

___

###  initializeWallet

▸ **initializeWallet**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/GSN.ts:51](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L51)*

**`desc`** Manually initialize a wallet for the signer. The main use case for this is to enable the signing of off chain orders

**Returns:** *Promise‹void›*

___

###  userHasInitializedWallet

▸ **userHasInitializedWallet**(`owner`: string): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/GSN.ts:41](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L41)*

**`desc`** Sees if the user actually has a wallet on chain already

**Parameters:**

Name | Type |
------ | ------ |
`owner` | string |

**Returns:** *Promise‹boolean›*

___

###  withdrawAllFunds

▸ **withdrawAllFunds**(`destination`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/GSN.ts:61](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L61)*

**`desc`** Withdraws signer ETH (as DAI) and wallet DAI to a destination address

**Parameters:**

Name | Type |
------ | ------ |
`destination` | string |

**Returns:** *Promise‹void›*

___

###  withdrawAllFundsEstimateGas

▸ **withdrawAllFundsEstimateGas**(`destination`: string): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/api/GSN.ts:76](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/GSN.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`destination` | string |

**Returns:** *Promise‹BigNumber›*
