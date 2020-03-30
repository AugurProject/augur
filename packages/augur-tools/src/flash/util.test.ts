import { sleep, waitFor } from './util';

test('waitFor', async (done) => {
  const fn = jest.fn();
  fn.mockReturnValue(false)

  waitFor(async () => fn(), 10, 100)
    .catch((err) => done(err));

  await sleep(1000); // wait for fn() to be called 10 times
  fn.mockReturnValue(true);
  await sleep(1000); // wait to be sure it won't be called 11+ times
  expect(fn).toBeCalledTimes(10)
})
