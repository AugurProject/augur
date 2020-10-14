[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/Uniswap"](../modules/_augur_sdk_src_api_uniswap_.md) › [Uniswap](_augur_sdk_src_api_uniswap_.uniswap.md)

# Class: Uniswap

## Hierarchy

* **Uniswap**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_uniswap_.uniswap.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_uniswap_.uniswap.md#private-readonly-augur)

### Methods

* [addLiquidity](_augur_sdk_src_api_uniswap_.uniswap.md#addliquidity)
* [getExchangeRate](_augur_sdk_src_api_uniswap_.uniswap.md#getexchangerate)
* [swapETHForExactTokens](_augur_sdk_src_api_uniswap_.uniswap.md#swapethforexacttokens)
* [swapExactTokensForETH](_augur_sdk_src_api_uniswap_.uniswap.md#swapexacttokensforeth)
* [swapExactTokensForTokens](_augur_sdk_src_api_uniswap_.uniswap.md#swapexacttokensfortokens)
* [swapTokensForExactETH](_augur_sdk_src_api_uniswap_.uniswap.md#swaptokensforexacteth)
* [swapTokensForExactTokens](_augur_sdk_src_api_uniswap_.uniswap.md#swaptokensforexacttokens)

## Constructors

###  constructor

\+ **new Uniswap**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[Uniswap](_augur_sdk_src_api_uniswap_.uniswap.md)*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:7](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[Uniswap](_augur_sdk_src_api_uniswap_.uniswap.md)*

## Properties

### `Private` `Readonly` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:8](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L8)*

## Methods

###  addLiquidity

▸ **addLiquidity**(`token0`: string, `token1`: string, `amount0Desired`: BigNumber, `amount1Desired`: BigNumber, `amount0Min`: BigNumber, `amount1Min`: BigNumber): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L16)*

**`desc`** Adds liquidity to a normal token exchange

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token0` | string | the first token address |
`token1` | string | the second token address |
`amount0Desired` | BigNumber | - |
`amount1Desired` | BigNumber | - |
`amount0Min` | BigNumber | - |
`amount1Min` | BigNumber | - |

**Returns:** *Promise‹void›*

___

###  getExchangeRate

▸ **getExchangeRate**(`token0`: string, `token1`: string): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:166](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L166)*

**`desc`** Gives the exchange rate for two tokens in terms of the proceeds in terms of token0 for the sale of 1 token0

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token0` | string | the first token address |
`token1` | string | the second token address |

**Returns:** *Promise‹BigNumber›*

___

###  swapETHForExactTokens

▸ **swapETHForExactTokens**(`token`: string, `exactTokenAmount`: BigNumber, `maxETHAmount`: BigNumber): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:143](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L143)*

**`desc`** Swaps a maximum amount of ETH in exchange for an exact amount of tokens

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token` | string | the token address |
`exactTokenAmount` | BigNumber | the exact amount of tokens to be recieved |
`maxETHAmount` | BigNumber | the maximum amount of ETH to be spent |

**Returns:** *Promise‹void›*

___

###  swapExactTokensForETH

▸ **swapExactTokensForETH**(`token`: string, `exactTokenAmount`: BigNumber, `minETHAmount`: BigNumber): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:119](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L119)*

**`desc`** Swaps an exact number of tokens in exchange for a minimum amount of ETH

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token` | string | the token address |
`exactTokenAmount` | BigNumber | the exact amount of tokens in |
`minETHAmount` | BigNumber | the minimum amount of ETH to be received |

**Returns:** *Promise‹void›*

___

###  swapExactTokensForTokens

▸ **swapExactTokensForTokens**(`token0`: string, `token1`: string, `exactToken0Amount`: BigNumber, `minToken1Amount`: BigNumber): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:71](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L71)*

**`desc`** Swaps an exact number of tokens in exchange for a minimum number of tokens

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token0` | string | the exact-value token address |
`token1` | string | the min-value token address |
`exactToken0Amount` | BigNumber | the exact amount of token0 tokens in |
`minToken1Amount` | BigNumber | the minimum amount of token1 tokens to be received |

**Returns:** *Promise‹void›*

___

###  swapTokensForExactETH

▸ **swapTokensForExactETH**(`token`: string, `maxTokenAmount`: BigNumber, `exactETHAmount`: BigNumber): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:95](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L95)*

**`desc`** Swaps an maximum number of tokens in exchange for an exact amount of ETH

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token` | string | the token address |
`maxTokenAmount` | BigNumber | the maximum amount of tokens in |
`exactETHAmount` | BigNumber | the exact amount of ETH to be received |

**Returns:** *Promise‹void›*

___

###  swapTokensForExactTokens

▸ **swapTokensForExactTokens**(`token0`: string, `token1`: string, `maxToken0Amount`: BigNumber, `exactToken1Amount`: BigNumber): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/Uniswap.ts:46](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Uniswap.ts#L46)*

**`desc`** Swaps a maximum number of tokens in exchange for an exact number of tokens

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`token0` | string | the exact-value token address |
`token1` | string | the max-value token address |
`maxToken0Amount` | BigNumber | the maximum amount of token0 tokens in |
`exactToken1Amount` | BigNumber | the exact amount of token1 tokens to be received |

**Returns:** *Promise‹void›*
