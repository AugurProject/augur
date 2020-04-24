import { EventEmitter } from 'events';
import { Subscriptions } from './subscriptions';

describe('subscriptions', () => {
  let baseEmitter: EventEmitter;
  let subscriptions: Subscriptions;

  beforeAll(() => {
    baseEmitter = new EventEmitter();
    subscriptions = new Subscriptions(baseEmitter);
  });

  describe('subscribe method', () => {
    describe('without a payload', () => {
      test('should trigger cb when emitting from parent emitter.', done => {
        subscriptions.subscribe('someEvent', () => {
          done();
        });

        baseEmitter.emit('someEvent');
      });

      test('should trigger cb when emitting from subscription instance.', done => {
        subscriptions.subscribe('someEvent', () => {
          done();
        });

        subscriptions.emit('someEvent');
      });
    });
  });
});
