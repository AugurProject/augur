[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/events"](../modules/_augur_sdk_src_events_.md) › [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md)

# Class: EventNameEmitter

## Hierarchy

* EventEmitter

  ↳ **EventNameEmitter**

## Index

### Constructors

* [constructor](_augur_sdk_src_events_.eventnameemitter.md#constructor)

### Properties

* [defaultMaxListeners](_augur_sdk_src_events_.eventnameemitter.md#static-defaultmaxlisteners)

### Methods

* [addListener](_augur_sdk_src_events_.eventnameemitter.md#addlistener)
* [emit](_augur_sdk_src_events_.eventnameemitter.md#emit)
* [eventNames](_augur_sdk_src_events_.eventnameemitter.md#eventnames)
* [getMaxListeners](_augur_sdk_src_events_.eventnameemitter.md#getmaxlisteners)
* [listenerCount](_augur_sdk_src_events_.eventnameemitter.md#listenercount)
* [listeners](_augur_sdk_src_events_.eventnameemitter.md#listeners)
* [off](_augur_sdk_src_events_.eventnameemitter.md#off)
* [on](_augur_sdk_src_events_.eventnameemitter.md#on)
* [once](_augur_sdk_src_events_.eventnameemitter.md#once)
* [prependListener](_augur_sdk_src_events_.eventnameemitter.md#prependlistener)
* [prependOnceListener](_augur_sdk_src_events_.eventnameemitter.md#prependoncelistener)
* [rawListeners](_augur_sdk_src_events_.eventnameemitter.md#rawlisteners)
* [removeAllListeners](_augur_sdk_src_events_.eventnameemitter.md#removealllisteners)
* [removeListener](_augur_sdk_src_events_.eventnameemitter.md#removelistener)
* [setMaxListeners](_augur_sdk_src_events_.eventnameemitter.md#setmaxlisteners)
* [listenerCount](_augur_sdk_src_events_.eventnameemitter.md#static-listenercount)

## Constructors

###  constructor

\+ **new EventNameEmitter**(`options?`: EventEmitterOptions): *[EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md)*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[constructor](_augur_sdk_src_events_.eventnameemitter.md#constructor)*

Defined in node_modules/@types/node/events.d.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`options?` | EventEmitterOptions |

**Returns:** *[EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md)*

## Properties

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[defaultMaxListeners](_augur_sdk_src_events_.eventnameemitter.md#static-defaultmaxlisteners)*

Defined in node_modules/@types/node/events.d.ts:45

## Methods

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[addListener](_augur_sdk_src_events_.eventnameemitter.md#addlistener)*

Defined in node_modules/@types/node/globals.d.ts:547

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

▸ **emit**(`eventName`: [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) | string, ...`args`: any[]): *boolean*

*Overrides void*

*Defined in [packages/augur-sdk/src/events.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/events.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md) &#124; string |
`...args` | any[] |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[eventNames](_augur_sdk_src_events_.eventnameemitter.md#eventnames)*

Defined in node_modules/@types/node/globals.d.ts:562

**Returns:** *Array‹string | symbol›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[getMaxListeners](_augur_sdk_src_events_.eventnameemitter.md#getmaxlisteners)*

Defined in node_modules/@types/node/globals.d.ts:554

**Returns:** *number*

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[listenerCount](_augur_sdk_src_events_.eventnameemitter.md#listenercount)*

Defined in node_modules/@types/node/globals.d.ts:558

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *Function[]*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[listeners](_augur_sdk_src_events_.eventnameemitter.md#listeners)*

Defined in node_modules/@types/node/globals.d.ts:555

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[off](_augur_sdk_src_events_.eventnameemitter.md#off)*

Defined in node_modules/@types/node/globals.d.ts:551

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

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[on](_augur_sdk_src_events_.eventnameemitter.md#on)*

Defined in node_modules/@types/node/globals.d.ts:548

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

Defined in node_modules/@types/node/globals.d.ts:549

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

Defined in node_modules/@types/node/globals.d.ts:560

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

Defined in node_modules/@types/node/globals.d.ts:561

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

Defined in node_modules/@types/node/globals.d.ts:556

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *Function[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[removeAllListeners](_augur_sdk_src_events_.eventnameemitter.md#removealllisteners)*

Defined in node_modules/@types/node/globals.d.ts:552

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [EventNameEmitter](_augur_sdk_src_events_.eventnameemitter.md).[removeListener](_augur_sdk_src_events_.eventnameemitter.md#removelistener)*

Defined in node_modules/@types/node/globals.d.ts:550

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

Defined in node_modules/@types/node/globals.d.ts:553

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

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
