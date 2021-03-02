import ApolloClient from 'apollo-boost';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Cash } from '../utils/types';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ErrorPolicy, FetchPolicy } from 'apollo-client';
import { ETH } from '../utils/constants';
import gql from 'graphql-tag';


// // @ts-ignore
const PARA_CONFIG = process.env.CONFIGURATION || {};

  // @ts-ignore
const GET_BLOCK = timestamp => {
  const queryString = `
  {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }
    ) {
      id
      number
      timestamp
    }
  }
`
 return gql(queryString)
};

// Get all markets except CATEGORICAL
// https://thegraph.com/explorer/subgraph/augurproject/augur-v2-staging
  // @ts-ignore
const GET_MARKETS = blockNumber => {
  const queryString = `
  {
  markets(where: { marketType: YES_NO, description_not: null, fee_lte: 20000000000000000 }) {
    description
    id
    outcomes {
      id
      value
      isFinalNumerator
      payoutNumerator
    }
    marketType
    numTicks
    timestamp
    fee
    openInterest
    outcomeVolumes
    prices
    designatedReporter
    extraInfoRaw
    currentDisputeWindow {
      id
      endTime
    }
    shareTokens {
      id
    }
    owner {
      id
    }
    creator {
      id
    }
    offsetName
    template {
      id
      question
    }
    noShowBond
    universe {
      id
      reportingFee
    }
    endTimestamp
    status
    categories
    tradingProceedsClaimed {
      id
			shareToken {
        id
      }
      sender {
        id
      }
      outcome
      numPayoutTokens
      fees
      timestamp
    }
    amms {
      id
      shareToken {
        id
        cash {
          id
        }
      }
      volumeYes
      volumeNo
      percentageYes
      percentageNo
      liquidity
      liquidityYes
      liquidityNo
      liquidityInvalid
      totalSupply
      cashBalance
      fee
      feePercent
      swaps {
        id
        sender {
          id
        }
        tx_hash
        timestamp
        yesShares
        noShares
      }
      enters {
        id
        sender {
          id
        }
        tx_hash
        timestamp
        yesShares
        noShares
        price
        cash
      }
      exits {
        id
        sender {
          id
        }
        tx_hash
        price
        timestamp
        yesShares
        noShares
        cash
      }
      addLiquidity {
        id
        sender {
          id
        }
        tx_hash
        timestamp
        yesShares
        noShares
        cash
        cashValue
        lpTokens
        noShareCashValue
        yesShareCashValue
        netShares
      }
      removeLiquidity {
        id
        sender {
          id
        }
        tx_hash
        timestamp
        yesShares
        noShares
        cashValue
        noShareCashValue
        yesShareCashValue
      }
    }
  }
  paraShareTokens {
    id
    cash {
      id
      decimals
      symbol
    }
  }
  past: markets(block: { number: ${blockNumber} }, where: { marketType: YES_NO, description_not: null }) {
    description
    id
    endTimestamp
    status
    amms {
      id
      shareToken {
        id
        cash {
          id
        }
      }
      volumeYes
      volumeNo
      percentageYes
      percentageNo
      liquidity
      liquidityYes
      liquidityNo
      liquidityInvalid
      totalSupply
      cashBalance
      swaps {
        id
        tx_hash
        timestamp
        yesShares
        noShares
      }
      enters {
        id
        tx_hash
        timestamp
        yesShares
        noShares
        price
        cash
      }
      exits {
        id
        tx_hash
        timestamp
        yesShares
        noShares
        price
        cash
      }
    }
  }
}
 `
  return gql(queryString)
};

export const CASH_TOKEN_DATA = gql`
  query tokenDayDatas($tokenAddr: String!) {
    tokenDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { token: $tokenAddr }) {
      id
      date
      priceUSD
    }
  }
`;


dayjs.extend(utc);

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

const client = augurV2Client(
  'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2'
);

const healthClient = augurV2Client(
  'https://api.thegraph.com/index-node/graphql'
);

function blockClient(uri) {
  return new ApolloClient({
    uri,
  });
}

function augurV2Client(uri) {
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });
  // @ts-ignore
  client.defaultOptions = defaultOptions;
  return client;
}
// @ts-ignore
export async function getMarketsData(updateHeartbeat) {
  //const cashes = getCashesInfo();
  const clientConfig = getClientConfig();
  let response = null;
  let responseUsd = null;
  let newBlock = null;
  try {
   newBlock = await getPastDayBlockNumber(clientConfig.blockClient);
    const query = GET_MARKETS(newBlock);
    response = await augurV2Client(clientConfig.augurClient).query({ query });
    //responseUsd = await getCashTokenData(cashes);
  } catch (e) {
    console.error(e);
    updateHeartbeat(null, null, e);
  }

  //if (!responseUsd) return updateHeartbeat(null, null, 'Data could not be retreived');
  if (response) {
    if (response.errors) {
      console.error(JSON.stringify(response.errors, null, 1));
    }

    updateHeartbeat(
      {
        ...response.data,
      },
      newBlock,
      response?.errors
    );
  }
}

// https://thegraph.com/explorer/subgraph/augurproject/augur-v2-staging
// kovan playground
const getClientConfig = () => {
  // @ts-ignore
  const { networkId } = PARA_CONFIG;
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
  return clientConfig[Number(42)];
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

// @ts-ignore
const getCashTokenData = async (cashes) => {
  const bulkResults = await Promise.all(
    // @ts-ignore
    cashes?.map(async (cash) => {
      let usdPrice = await client.query({
            // @ts-ignore
        query: CASH_TOKEN_DATA,
        variables: {
          tokenAddr: cash?.address,
        },
        fetchPolicy: 'cache-first',
      });
      let tokenData = { usdPrice: usdPrice?.data?.tokenDayDatas[0], ...cash };
      if (!tokenData.usdPrice) {
        // TODO: remove this, used only form kovan testing
        tokenData = {
          ...cash,
          usdPrice: cash?.name === 'ETH' ? '1300' : '1',
        };
      }
      return tokenData;
    })
  );
  // @ts-ignore
  return (bulkResults || []).reduce((p, a) => ({ ...p, [a.address]: a }), {});
};

// /**
//  * @notice Fetches first block after a given timestamp
//  * @dev Query speed is optimized by limiting to a 600-second period
//  * @param {Int} timestamp in seconds
//  */
//   // @ts-ignore

export async function getBlockFromTimestamp(timestamp, url) {
  const result = await blockClient(url).query({
    query: GET_BLOCK(timestamp),
  });
  return result ? result?.data?.blocks?.[0]?.number : 0;
}
// //   // @ts-ignore

async function getPastDayBlockNumber(blockClient) {
  // @ts-ignore
  const utcCurrentTime = dayjs.utc();
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix();
  const block = await getBlockFromTimestamp(utcOneDayBack, blockClient);
  return block;
}

const getCashesInfo = () => {
    // @ts-ignore
    const { networkId, paraDeploys } = PARA_CONFIG;
    const paraValues = Object.values({paraDeploys});
    const keysValues = paraValues.reduce((p, v) => ({ ...p, [v.name]: v }), {});
    const cashes = paraCashes[String(42)].Cashes;
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
  