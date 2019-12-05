---
id: api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider
title: ProviderSubprovider
sidebar_label: ProviderSubprovider
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/zeroX/ProviderSubprovider Module]](api-modules-augur-sdk-src-zerox-providersubprovider-module.md) > [ProviderSubprovider](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md)

## Class

## Hierarchy

 `Subprovider`

**↳ ProviderSubprovider**

### Constructors

* [constructor](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md#constructor)

### Properties

* [provider](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md#provider)

### Methods

* [emitPayloadAsync](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md#emitpayloadasync)
* [handleRequest](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md#handlerequest)
* [setEngine](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md#setengine)
* [_createFinalPayload](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md#_createfinalpayload)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ProviderSubprovider**(provider: *[Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)*): [ProviderSubprovider](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md)

*Defined in [augur-sdk/src/zeroX/ProviderSubprovider.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/zeroX/ProviderSubprovider.ts#L9)*

Instantiates a new SignerSubprovider

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | [Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md) |

**Returns:** [ProviderSubprovider](api-classes-augur-sdk-src-zerox-providersubprovider-providersubprovider.md)

___

## Properties

<a id="provider"></a>

### `<Private>` provider

**● provider**: *[Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)*

*Defined in [augur-sdk/src/zeroX/ProviderSubprovider.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/zeroX/ProviderSubprovider.ts#L9)*

___

## Methods

<a id="emitpayloadasync"></a>

###  emitPayloadAsync

▸ **emitPayloadAsync**(payload: *`Partial`<`JSONRPCRequestPayloadWithMethod`>*): `Promise`<`JSONRPCResponsePayload`>

*Inherited from Subprovider.emitPayloadAsync*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@0x/subproviders/lib/src/subproviders/subprovider.d.ts:25*

Emits a JSON RPC payload that will then be handled by the ProviderEngine instance this subprovider is a part of. The payload will cascade down the subprovider middleware stack until finding the responsible entity for handling the request.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| payload | `Partial`<`JSONRPCRequestPayloadWithMethod`> |  JSON RPC payload |

**Returns:** `Promise`<`JSONRPCResponsePayload`>
JSON RPC response payload

___
<a id="handlerequest"></a>

###  handleRequest

▸ **handleRequest**(payload: *`JSONRPCRequestPayload`*, next: *[Callback](api-modules-augur-sdk-src-events-module.md#callback)*, end: *`ErrorCallback`*): `Promise`<`void`>

*Overrides Subprovider.handleRequest*

*Defined in [augur-sdk/src/zeroX/ProviderSubprovider.ts:27](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/zeroX/ProviderSubprovider.ts#L27)*

This method conforms to the web3-provider-engine interface. It is called internally by the ProviderEngine when it is this subproviders turn to handle a JSON RPC request.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| payload | `JSONRPCRequestPayload` |  JSON RPC payload |
| next | [Callback](api-modules-augur-sdk-src-events-module.md#callback) |  Callback to call if this subprovider decides not to handle the request |
| end | `ErrorCallback` |  Callback to call if subprovider handled the request and wants to pass back the request. |

**Returns:** `Promise`<`void`>

___
<a id="setengine"></a>

###  setEngine

▸ **setEngine**(engine: *`Web3ProviderEngine`*): `void`

*Inherited from Subprovider.setEngine*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@0x/subproviders/lib/src/subproviders/subprovider.d.ts:32*

Set's the subprovider's engine to the ProviderEngine it is added to. This is only called within the ProviderEngine source code, do not call directly.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| engine | `Web3ProviderEngine` |  The ProviderEngine this subprovider is added to |

**Returns:** `void`

___
<a id="_createfinalpayload"></a>

### `<Static>``<Protected>` _createFinalPayload

▸ **_createFinalPayload**(payload: *`Partial`<`JSONRPCRequestPayloadWithMethod`>*): `Partial`<`JSONRPCRequestPayloadWithMethod`>

*Inherited from Subprovider._createFinalPayload*

*Defined in /Users/bthaile/gitrepos/augur/node_modules/@0x/subproviders/lib/src/subproviders/subprovider.d.ts:10*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payload | `Partial`<`JSONRPCRequestPayloadWithMethod`> |

**Returns:** `Partial`<`JSONRPCRequestPayloadWithMethod`>

___

