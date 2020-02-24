import { NetworkId } from '@augurproject/artifacts';
import { WebsocketConnector } from '@augurproject/sdk/build/connector/ws-connector';
import { SubscriptionEventName } from '@augurproject/sdk/build/constants';
import { NewBlock } from '@augurproject/sdk/build/events';
import { SDKConfiguration } from '@augurproject/sdk/build/state';
import { Markets } from '@augurproject/sdk/build/state/getter/Markets';

jest.mock('websocket-as-promised', () => {
  return jest.fn().mockImplementation(() => {
    return {
      open: () => true,
      close: () => true,
      onError: {
        addListener: () => {},
      },
      onMessage: {
        addListener: () => {},
      },
      onClose: {
        addListener: () => {},
      },
      async sendRequest(message: any): Promise<any> {
        return new Promise((resolve, reject) => {
          if (message.method === 'subscribe') {
            resolve({
              result: {
                subscription: '12345',
              },
            });
          } else if (message.method === 'unsubscribe') {
            resolve(true);
          } else {
            resolve(['0xa223fFddee6e9eB50513Be1B3C5aE9159c7B3407']);
          }
        });
      },
    };
  });
});

test('WebsocketConnector :: Should route correctly and handle events', async done => {
  const config: SDKConfiguration = {
    networkId: NetworkId.PrivateGanache,
    ethereum: {
      http: '',
      rpcRetryCount: 5,
      rpcRetryInterval: 0,
      rpcConcurrency: 40,
    },
    sdk: {
      ws: 'ws://localhost:9001',
    },
    syncing: {},
  };
  const connector = new WebsocketConnector();
  await connector.connect(config);

  await connector.on(
    SubscriptionEventName.NewBlock,
    async (arg: NewBlock): Promise<void> => {
      expect(arg).toEqual({
        '0': {
          blocksBehindCurrent: 0,
          eventName: SubscriptionEventName.NewBlock,
          highestAvailableBlockNumber: 88,
          lastSyncedBlockNumber: 88,
          percentSynced: '0.0000',
        },
        eventName: SubscriptionEventName.NewBlock,
      });

      const getMarkets = connector.bindTo(Markets.getMarkets);
      const marketList = await getMarkets({
        universe: '123456',
      });
      expect(marketList).toEqual([
        '0xa223fFddee6e9eB50513Be1B3C5aE9159c7B3407',
      ]);

      await connector.off(SubscriptionEventName.NewBlock);
      expect(connector.subscriptions).toEqual({});
      await connector.disconnect();
      done();
    }
  );

  // this should invoke the callback ... if not done won't be called
  setTimeout(() => {
    connector.messageReceived({
      eventName: SubscriptionEventName.NewBlock,
      result: [
        {
          eventName: SubscriptionEventName.NewBlock,
          highestAvailableBlockNumber: 88,
          lastSyncedBlockNumber: 88,
          blocksBehindCurrent: 0,
          percentSynced: '0.0000',
        },
      ],
    });
  }, 0);
});
