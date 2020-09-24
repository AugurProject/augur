// An example how to use Augur to retrieve data
import {
  MarketCreated,
  NewBlock,
  SubscriptionEventName,
} from '@augurproject/sdk-lite';
//
//
import { NetworkId, SDKConfiguration } from '@augurproject/utils';
import { SingleThreadConnector } from '../connector';
import { startServer } from './create-api';

console.log('Starting web worker');
(async () => {
  try {
    const config: SDKConfiguration = {
      networkId: NetworkId.Kovan,
      uploadBlockNumber: 16622921,
      ethereum: {
        http: 'https://eth-rinkeby.alchemyapi.io/v2/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM',
        rpcRetryCount: 5,
        rpcRetryInterval: 0,
        rpcConcurrency: 40,
      },
      syncing: {
        enabled: false,
      },
    };

    const api = await startServer(config);

    const connector = new SingleThreadConnector();
    await connector.connect(config);

    const augur = api.augur;
    augur.connector = connector;

    connector.on(
      SubscriptionEventName.MarketCreated,
      (...args: MarketCreated[]): void => {
        console.log(args);
        augur.off(SubscriptionEventName.CompleteSetsPurchased);
      }
    );

    connector.on(
      SubscriptionEventName.NewBlock,
      (...args: NewBlock[]): void => {
        console.log(args);
      }
    );

    const markets = await augur.getMarkets({
      universe: '0x02149d40d255fceac54a3ee3899807b0539bad60',
    });

    console.log(markets);
    console.log('Done');
  } catch (e) {
    console.log(e);
  }
})();
