import { BigNumber } from '@0x/utils';
import * as Comlink from 'comlink';
import { mapValues } from 'lodash';

const serialize = item => {
  if (item === null || typeof item === 'undefined') return item;
  if (Array.isArray(item)) return item.map(serialize);
  if (BigNumber.isBigNumber(item)) {
    return {
      _isBigNumber: true,
      value: item.toString(),
    };
  }
  if (typeof item === 'object') return mapValues(item, serialize);
  return item;
};

const deserialize = item => {
  if (item === null || typeof item === 'undefined') return item;
  if (Array.isArray(item)) return item.map(deserialize);
  if (item?._isBigNumber) return new BigNumber(item.value);
  if (typeof item === 'object') return mapValues(item, deserialize);
  return item;
};

Comlink.transferHandlers.set('BigNumber', {
  canHandle(obj) {
    return true;
  },
  serialize(obj) {
    return [serialize(obj), []];
  },
  deserialize,
});
