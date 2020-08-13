[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/subscriptions"](../modules/_augur_sdk_src_subscriptions_.md) › [Subscriptions](_augur_sdk_src_subscriptions_.subscriptions.md)

# Class: Subscriptions

## Hierarchy

* EventEmitter

  ↳ **Subscriptions**

## Index

### Constructors

* [constructor](_augur_sdk_src_subscriptions_.subscriptions.md#constructor)

### Properties

* [parentEmitter](_augur_sdk_src_subscriptions_.subscriptions.md#private-parentemitter)
* [waitingOn](_augur_sdk_src_subscriptions_.subscriptions.md#private-waitingon)
* [defaultMaxListeners](_augur_sdk_src_subscriptions_.subscriptions.md#static-defaultmaxlisteners)
* [errorMonitor](_augur_sdk_src_subscriptions_.subscriptions.md#static-readonly-errormonitor)

### Methods

* [addListener](_augur_sdk_src_subscriptions_.subscriptions.md#addlistener)
* [emit](_augur_sdk_src_subscriptions_.subscriptions.md#emit)
* [emitAfter](_augur_sdk_src_subscriptions_.subscriptions.md#emitafter)
* [eventNames](_augur_sdk_src_subscriptions_.subscriptions.md#eventnames)
* [getMaxListeners](_augur_sdk_src_subscriptions_.subscriptions.md#getmaxlisteners)
* [listenerCount](_augur_sdk_src_subscriptions_.subscriptions.md#listenercount)
* [listeners](_augur_sdk_src_subscriptions_.subscriptions.md#listeners)
* [off](_augur_sdk_src_subscriptions_.subscriptions.md#off)
* [on](_augur_sdk_src_subscriptions_.subscriptions.md#on)
* [once](_augur_sdk_src_subscriptions_.subscriptions.md#once)
* [prependListener](_augur_sdk_src_subscriptions_.subscriptions.md#prependlistener)
* [prependOnceListener](_augur_sdk_src_subscriptions_.subscriptions.md#prependoncelistener)
* [rawListeners](_augur_sdk_src_subscriptions_.subscriptions.md#rawlisteners)
* [removeAllListeners](_augur_sdk_src_subscriptions_.subscriptions.md#removealllisteners)
* [removeListener](_augur_sdk_src_subscriptions_.subscriptions.md#removelistener)
* [setMaxListeners](_augur_sdk_src_subscriptions_.subscriptions.md#setmaxlisteners)
* [subscribe](_augur_sdk_src_subscriptions_.subscriptions.md#subscribe)
* [subscribeToEvent](_augur_sdk_src_subscriptions_.subscriptions.md#private-subscribetoevent)
* [unsubscribe](_augur_sdk_src_subscriptions_.subscriptions.md#unsubscribe)
* [listenerCount](_augur_sdk_src_subscriptions_.subscriptions.md#static-listenercount)

## Constructors

###  constructor

\+ **new Subscriptions**(`parentEmitter`: EventEmitter): *[Subscriptions](_augur_sdk_src_subscriptions_.subscriptions.md)*

*Overrides [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[constructor](_augur_sdk_src_events_.eventnameemitter.md#constructor)*

*Defined in [packages/augur-sdk/src/subscriptions.ts:15](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`parentEmitter` | EventEmitter |

**Returns:** *[Subscriptions](_augur_sdk_src_subscriptions_.subscriptions.md)*

## Properties

### `Private` parentEmitter

• **parentEmitter**: *EventEmitter*

*Defined in [packages/augur-sdk/src/subscriptions.ts:14](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L14)*

___

### `Private` waitingOn

• **waitingOn**: *[WaitingOn](../interfaces/_augur_sdk_src_subscriptions_.waitingon.md)*

*Defined in [packages/augur-sdk/src/subscriptions.ts:15](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L15)*

___

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[defaultMaxListeners](_augur_sdk_src_events_.eventnameemitter.md#static-defaultmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:45

___

### `Static` `Readonly` errorMonitor

▪ **errorMonitor**: *keyof symbol*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[errorMonitor](_augur_sdk_src_events_.eventnameemitter.md#static-readonly-errormonitor)*

Defined in node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Methods

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[addListener](_augur_sdk_src_events_.eventnameemitter.md#addlistener)*

Defined in node_modules/@types/node/globals.d.ts:553

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  emit

▸ **emit**(`event`: string, ...`args`: any[]): *boolean*

*Overrides void*

*Defined in [packages/augur-sdk/src/subscriptions.ts:40](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | string |
`...args` | any[] |

**Returns:** *boolean*

___

###  emitAfter

▸ **emitAfter**(`after`: string, `eventName`: string, ...`eventArgs`: any[]): *void*

*Defined in [packages/augur-sdk/src/subscriptions.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`after` | string |
`eventName` | string |
`...eventArgs` | any[] |

**Returns:** *void*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[eventNames](_augur_sdk_src_events_.eventnameemitter.md#eventnames)*

Defined in node_modules/@types/node/globals.d.ts:568

**Returns:** *Array‹string | symbol›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[getMaxListeners](_augur_sdk_src_events_.eventnameemitter.md#getmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:560

**Returns:** *number*

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[listenerCount](_augur_sdk_src_events_.eventnameemitter.md#listenercount)*

Defined in node_modules/@types/node/globals.d.ts:564

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[listeners](_augur_sdk_src_events_.eventnameemitter.md#listeners)*

Defined in node_modules/@types/node/globals.d.ts:561

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Overrides [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[off](_augur_sdk_src_events_.eventnameemitter.md#off)*

*Defined in [packages/augur-sdk/src/subscriptions.ts:57](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L57)*

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Overrides [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[on](_augur_sdk_src_events_.eventnameemitter.md#on)*

*Defined in [packages/augur-sdk/src/subscriptions.ts:51](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L51)*

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[once](_augur_sdk_src_events_.eventnameemitter.md#once)*

Defined in node_modules/@types/node/globals.d.ts:555

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[prependListener](_augur_sdk_src_events_.eventnameemitter.md#prependlistener)*

Defined in node_modules/@types/node/globals.d.ts:566

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[prependOnceListener](_augur_sdk_src_events_.eventnameemitter.md#prependoncelistener)*

Defined in node_modules/@types/node/globals.d.ts:567

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *Function[]*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[rawListeners](_augur_sdk_src_events_.eventnameemitter.md#rawlisteners)*

Defined in node_modules/@types/node/globals.d.ts:562

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`eventName?`: string | symbol): *this*

*Overrides [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[removeAllListeners](_augur_sdk_src_events_.eventnameemitter.md#removealllisteners)*

*Defined in [packages/augur-sdk/src/subscriptions.ts:63](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[removeListener](_augur_sdk_src_events_.eventnameemitter.md#removelistener)*

Defined in node_modules/@types/node/globals.d.ts:556

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[setMaxListeners](_augur_sdk_src_events_.eventnameemitter.md#setmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:559

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

###  subscribe

▸ **subscribe**(`eventName`: string, `publish`: function): *string*

*Defined in [packages/augur-sdk/src/subscriptions.ts:24](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L24)*

**Parameters:**

▪ **eventName**: *string*

▪ **publish**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *string*

___

### `Private` subscribeToEvent

▸ **subscribeToEvent**(`eventName`: string, `publish`: function): *string*

*Defined in [packages/augur-sdk/src/subscriptions.ts:68](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L68)*

**Parameters:**

▪ **eventName**: *string*

▪ **publish**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *string*

___

###  unsubscribe

▸ **unsubscribe**(`subscription`: string): *void*

*Defined in [packages/augur-sdk/src/subscriptions.ts:28](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/subscriptions.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`subscription` | string |

**Returns:** *void*

___

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): *number*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[listenerCount](_augur_sdk_src_events_.eventnameemitter.md#static-listenercount)*

Defined in node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string &#124; symbol |

**Returns:** *number*
