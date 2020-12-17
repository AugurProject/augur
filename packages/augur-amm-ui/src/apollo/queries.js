import gql from 'graphql-tag'

export const SUBGRAPH_HEALTH = gql`
  query health {
    indexingStatusForCurrentVersion(subgraphName: "ianlapham/uniswapv2") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`

export const GET_BLOCK = timestamp => {
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
}

// Get all markets except CATEGORICAL
// https://thegraph.com/explorer/subgraph/augurproject/augur-v2-staging
export const GET_MARKETS = blockNumber => {
  const queryString = `
  {
  markets(where: { marketType: YES_NO, description_not: null, fee_lte: 20000000000000000}) {
    description
    id
    endTimestamp
    status
    categories
    outcomes {
      id
      isFinalNumerator
      payoutNumerator
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
      liquidityCash
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
        cash
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
      liquidityCash
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
}

export const ETH_PRICE = (networkId, block) => {
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${networkId} } block: {number: ${block}}) {
        id
        ethPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${networkId} }) {
        id
        ethPrice
      }
    }
  `
  return gql(queryString)
}

export const TOKEN_SEARCH = gql`
  query tokens($value: String, $id: String) {
    asSymbol: tokens(where: { symbol_contains: $value }, orderBy: totalLiquidity, orderDirection: desc) {
      id
      symbol
      name
      totalLiquidity
    }
    asName: tokens(where: { name_contains: $value }, orderBy: totalLiquidity, orderDirection: desc) {
      id
      symbol
      name
      totalLiquidity
    }
    asAddress: tokens(where: { id: $id }, orderBy: totalLiquidity, orderDirection: desc) {
      id
      symbol
      name
      totalLiquidity
    }
  }
`

export const CASH_TOKEN_DATA = gql`
  query tokenDayDatas($tokenAddr: String!) {
    tokenDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { token: $tokenAddr }) {
      id
      date
      priceUSD
    }
  }
`
