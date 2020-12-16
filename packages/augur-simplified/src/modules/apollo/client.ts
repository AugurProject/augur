import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { GET_MARKETS, GET_BLOCK } from 'modules/apollo/queries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
  }),
  cache: new InMemoryCache(),
  // @ts-ignore
  shouldBatch: true,
});

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/index-node/graphql',
  }),
  cache: new InMemoryCache(),
  // @ts-ignore
  shouldBatch: true,
});

export function blockClient(uri: string) {
  return new ApolloClient({
    link: new HttpLink({
      uri,
    }),
    cache: new InMemoryCache(),
    // @ts-ignore
    shouldBatch: true,
  });
}

export function augurV2Client(uri: string) {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };
  return new ApolloClient({
    link: new HttpLink({
      uri,
    }),
    cache: new InMemoryCache(),
    // @ts-ignore
    defaultOptions: defaultOptions,
  });
}

export async function test(updateMarkets) {
  const config = getConfig();
  let response = null;
  try {
    const block = await getPastDayBlockNumber(config);
    const query = GET_MARKETS(block);
    response = await augurV2Client(config.augurClient).query({ query });
  } catch (e) {
    console.error(e);
  }

  if (response) {
    console.log(JSON.stringify(response.data, null, 1));
    updateMarkets(response.data);
  }
}

async function getPastDayBlockNumber(config) {
  // @ts-ignore
  const utcCurrentTime = dayjs.utc();
  let block = null;
  try {
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix();
    block = await getBlockFromTimestamp(utcOneDayBack, config.blockClient);
  } catch (e) {
    console.error('get past day block number', e);
  }
  return block;
}
const DEFAULT_NETWORK = '1';

function getConfig() {
  const network = process.env.network || DEFAULT_NETWORK;
  return jsonConfig[String(network)];
}

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp, url) {
  let result = null;
  try {
    result = await blockClient(url).query({
      query: GET_BLOCK(timestamp),
    });
  } catch (e) {
    console.error('getBlockFromTimestamp', e);
  }
  return result ? result?.data?.blocks?.[0]?.number : 0;
}

const jsonConfig = {
  '1': {
    networkId: '1',
    Cashes: [
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        name: 'wrapped ETH',
        symbol: 'wETH',
      },
      {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        name: 'DAI',
        symbol: 'DAI',
      },
    ],
    augurClient:
      'https://api.thegraph.com/subgraphs/name/augurproject/augur-v2-staging',
    blockClient:
      'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    network: 'mainnet',
  },
  '42': {
    networkId: '42',
    Cashes: [
      {
        address: '0x7290c2b7D5Fc91a112d462fe06aBBB8948668f56',
        name: 'ETH',
        symbol: 'ETH',
        asset: 'eth.svg',
      },
      {
        address: '0x25e27c08B7B3f2159aC23e4711801e0F7aD270A3',
        name: 'DAI',
        symbol: 'DAI',
        asset: 'dai.svg',
      },
      {
        address: '0x1997d08B1a9aeD5143b995e929707400625D5f6C',
        name: 'USDT',
        symbol: 'USDT',
        asset: 'usdt.svg',
      },
    ],
    augurClient:
      'https://api.thegraph.com/subgraphs/name/augurproject/augur-v2-staging',
    blockClient:
      'https://api.thegraph.com/subgraphs/name/blocklytics/kovan-blocks',
    network: 'kovan',
  },
};
