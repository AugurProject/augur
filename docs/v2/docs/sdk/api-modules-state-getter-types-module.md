---
id: api-modules-state-getter-types-module
title: state/getter/types Module
sidebar_label: state/getter/types
---

[@augurproject/sdk](api-readme.md) > [[state/getter/types Module]](api-modules-state-getter-types-module.md)

## Module

### Interfaces

* [EndpointSettings](api-interfaces-state-getter-types-endpointsettings.md)
* [JsonRpcRequest](api-interfaces-state-getter-types-jsonrpcrequest.md)

### Variables

* [SortLimit](api-modules-state-getter-types-module.md#sortlimit)

---

## Variables

<a id="sortlimit"></a>

### `<Const>` SortLimit

**● SortLimit**: *`any`* =  t.partial({
  sortBy: t.string,
  isSortDescending: t.boolean,
  limit: t.number,
  offset: t.number,
})

*Defined in [state/getter/types.ts:3](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/types.ts#L3)*

___

