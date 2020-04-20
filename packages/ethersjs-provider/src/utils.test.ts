import { Counter } from './index';

describe('Counter', () => {
  const KEY = 'eth_call';
  const KEY1 = 'eth_getLogs';
  let target;

  beforeEach(async () => {
    target = new Counter()
  });

  describe('methods', () => {
    test('increment', () => {
      target.increment(KEY);
      expect(target.get(KEY)).toEqual(1);
    });

    test('decrement', () => {
      target.decrement(KEY);
      expect(target.get(KEY)).toEqual(-1);
    });

    test('toTabularData', () => {
      target.set(KEY, 4);
      target.set(KEY1, 3);

      expect(target.toTabularData()).toEqual([{
        method: KEY,
        count: 4,
      }, {
        method: KEY1,
        count: 3,
      }]);
    });
  });
});
