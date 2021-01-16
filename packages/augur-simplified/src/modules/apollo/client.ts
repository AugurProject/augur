import ApolloClient from 'apollo-boost';
import { GET_MARKETS, GET_BLOCK, CASH_TOKEN_DATA } from 'modules/apollo/queries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Cash } from '../types';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ErrorPolicy, FetchPolicy } from 'apollo-client';

dayjs.extend(utc);

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache' as FetchPolicy,
    errorPolicy: 'ignore' as ErrorPolicy,
  },
  query: {
    fetchPolicy: 'no-cache' as FetchPolicy,
    errorPolicy: 'all' as ErrorPolicy,
  },
};

export const client = augurV2Client('https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2');

export const healthClient = augurV2Client('https://api.thegraph.com/index-node/graphql');

export function blockClient(uri: string) {
  return new ApolloClient({
    uri,
  });
}

export function augurV2Client(uri: string) {
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache({
      addTypename: false
    })
  });
  client.defaultOptions = defaultOptions;
  return client;
}

export async function getMarketsData(paraConfig, updateBlocknumber, updateMarkets) {
  const { networkId } = paraConfig;
  const cashes = jsonConfig[Number(networkId)].Cashes;
  const config = getConfig(networkId);
  let response = null;
  let responseUsd = null;
  try {
    const block = await getPastDayBlockNumber(config);
    updateBlocknumber(block);

    const query = GET_MARKETS(block);
    response = await augurV2Client(config.augurClient).query({ query });
    responseUsd = await getCashTokenData(cashes);
  } catch (e) {
    console.error(e);
  }

  if (response) {
    //console.log('response', JSON.stringify(response));
    if (response.errors) {
      console.error(JSON.stringify(response.errors, null, 1));
    }

    updateMarkets({ ...response.data, cashes: responseUsd });
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

function getConfig(networkId) {
  const network = networkId || DEFAULT_NETWORK;
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

const getCashTokenData = async (cashes: Cash[]): Promise<{ [address: string]: Cash }> => {
  let bulkResults = []
  try {
    bulkResults = await Promise.all(
      cashes.map(async cash => {
        let usdPrice = await client.query({
          query: CASH_TOKEN_DATA,
          variables: {
            tokenAddr: cash?.address
          },
          fetchPolicy: 'cache-first'
        })
        let tokenData = { usdPrice: usdPrice?.data?.tokenDayDatas[0], ...cash }
        if (!tokenData.usdPrice) {

          // TOOD remove this, used only form kovan testing
          tokenData = {
            ...cash,
            usdPrice: cash?.address.toLowerCase() === "0x7290c2b7D5Fc91a112d462fe06aBBB8948668f56".toLowerCase() ? '1050' : '1'
          }
        }
        return tokenData
      })
    )
  } catch (e) {
    console.error(e)
  }

  return (bulkResults || []).reduce((p, a) => ({ ...p, [a.address]: a }), {})
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
        address: '0x7290c2b7d5fc91a112d462fe06abbb8948668f56',
        shareToken: '0x4397472B541f64C5c8BFB390a574bAE87a964d17',
        name: 'ETH',
        symbol: 'ETH',
        asset: 'eth.svg',
        decimals: 18,
        displayDecimals: 4,
      },
      {
        address: '0x1997d08b1a9aed5143b995e929707400625d5f6c',
        shareToken: '0x0968E4c21d8bF774E74b409E2426B28e7BF11269',
        name: 'USDC',
        symbol: 'USDC',
        asset: 'usdt.svg',
        decimals: 6,
        displayDecimals: 2,
      },
    ],
    augurClient:
      'https://api.thegraph.com/subgraphs/name/augurproject/augur-v2-staging',
    blockClient:
      'https://api.thegraph.com/subgraphs/name/blocklytics/kovan-blocks',
    network: 'kovan',
  },
};
