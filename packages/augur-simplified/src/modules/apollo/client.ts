import ApolloClient from 'apollo-boost';
import {
  GET_MARKETS,
  GET_BLOCK,
  CASH_TOKEN_DATA,
} from 'modules/apollo/queries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Cash } from '../types';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ErrorPolicy, FetchPolicy } from 'apollo-client';
import { ETH } from '../constants';
import { SEARCH_MARKETS } from './queries';

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

export const client = augurV2Client(
  'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2'
);

export const healthClient = augurV2Client(
  'https://api.thegraph.com/index-node/graphql'
);

export function blockClient(uri: string) {
  return new ApolloClient({
    uri,
  });
}

export function augurV2Client(uri: string) {
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });
  client.defaultOptions = defaultOptions;
  return client;
}

export async function getMarketsData(paraConfig, updateHeartbeat) {
  const cashes = getCashesInfo(paraConfig);
  const clientConfig = getClientConfig(paraConfig);
  let response = null;
  let responseUsd = null;
  let newBlock = null;
  try {
    newBlock = await getPastDayBlockNumber(clientConfig.blockClient);
    const query = GET_MARKETS(newBlock);
    response = await augurV2Client(clientConfig.augurClient).query({ query });
    responseUsd = await getCashTokenData(cashes);
  } catch (e) {
    console.error(e);
    updateHeartbeat(null, null, e);
  }

  if (response) {
    if (response.errors) {
      console.error(JSON.stringify(response.errors, null, 1));
    }

    updateHeartbeat(
      {
        ...response.data,
        cashes: responseUsd,
      },
      newBlock,
      response?.errors
    );
  }
}

export async function searchMarkets(paraConfig, searchString, cb) {
  const clientConfig = getClientConfig(paraConfig);
  let response = null;
  if (searchString === '') return cb(null, []);
  const searchQuery = searchString.trim().split(' ').join(' & ');
  try {
    const query = SEARCH_MARKETS(`${searchQuery}:*`);
    response = await augurV2Client(clientConfig.augurClient).query({ query });
  } catch (e) {
    cb(e, []);
    console.error(e);
  }

  if (response) {
    if (response.errors) {
      console.error(JSON.stringify(response.errors, null, 1));
    }
    if (response?.data?.marketSearch)
      cb(null, [...response.data.marketSearch?.map((market) => market.id)]);
    else cb(null, []);
  }
}

async function getPastDayBlockNumber(blockClient) {
  // @ts-ignore
  const utcCurrentTime = dayjs.utc();
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix();
  const block = await getBlockFromTimestamp(utcOneDayBack, blockClient);
  return block;
}

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp, url) {
  const result = await blockClient(url).query({
    query: GET_BLOCK(timestamp),
  });
  return result ? result?.data?.blocks?.[0]?.number : 0;
}

const getCashTokenData = async (
  cashes: Cash[]
): Promise<{ [address: string]: Cash }> => {
  const bulkResults = await Promise.all(
    cashes.map(async (cash) => {
      let usdPrice = await client.query({
        query: CASH_TOKEN_DATA,
        variables: {
          tokenAddr: cash?.address,
        },
        fetchPolicy: 'cache-first',
      });
      let tokenData = { usdPrice: usdPrice?.data?.tokenDayDatas[0], ...cash };
      if (!tokenData.usdPrice) {
        // TOOD remove this, used only form kovan testing
        tokenData = {
          ...cash,
          usdPrice: cash?.name === ETH ? '1300' : '1',
        };
      }
      return tokenData;
    })
  );
  return (bulkResults || []).reduce((p, a) => ({ ...p, [a.address]: a }), {});
};

const getClientConfig = (
  paraDeploys
): { augurClient: string; blockClient: string } => {
  const { networkId } = paraDeploys;
  const clientConfig = {
    '1': {
      augurClient:
        'https://api.thegraph.com/subgraphs/name/augurproject/augur-v2-staging',
      blockClient:
        'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
      network: 'mainnet',
    },
    '42': {
      augurClient:
        'https://api.thegraph.com/subgraphs/name/augurproject/augur-v2-staging',
      blockClient:
        'https://api.thegraph.com/subgraphs/name/blocklytics/kovan-blocks',
      network: 'kovan',
    },
  };
  return clientConfig[Number(networkId)];
};

const paraCashes = {
  '1': {
    networkId: '1',
    Cashes: [
      {
        name: 'ETH',
        displayDecimals: 4,
      },
      {
        name: 'USDC',
        displayDecimals: 2,
      },
    ],
    network: 'mainnet',
  },
  '42': {
    networkId: '42',
    Cashes: [
      {
        name: 'ETH',
        displayDecimals: 4,
      },
      {
        name: 'USDC',
        displayDecimals: 2,
      },
    ],
    network: 'kovan',
  },
};

const getCashesInfo = (paraConfig: {
  networkId: string;
  paraDeploys: {
    [address: string]: {
      name: string;
      decimals: number;
      addresses: { Cash: string; ShareToken: string };
    };
  };
}): Cash[] => {
  const { networkId, paraDeploys } = paraConfig;
  const paraValues = Object.values(paraDeploys);
  const keysValues = paraValues.reduce((p, v) => ({ ...p, [v.name]: v }), {});
  const cashes = paraCashes[String(networkId)].Cashes;
  // fill in address and shareToken
  cashes.forEach((c) => {
    if (c.name === ETH) {
      const ethPara = keysValues['WETH'];
      if (!ethPara)
        throw new Error('WETH not found in para deploy configuration');
      c.address = ethPara.addresses.Cash.toLowerCase();
      c.shareToken = ethPara.addresses.ShareToken.toLowerCase();
      c.decimals = ethPara.decimals;
    } else {
      // TODO: will need to be changed, in mainnet deploy this will prob be 'USDC'
      const stablecoinPara = keysValues['USDT'];
      if (!stablecoinPara)
        throw new Error('USDT/USDC not found in para deploy configuration');
      c.address = stablecoinPara.addresses.Cash.toLowerCase();
      c.shareToken = stablecoinPara.addresses.ShareToken.toLowerCase();
      c.decimals = stablecoinPara.decimals;
    }
  });

  return cashes;
};
