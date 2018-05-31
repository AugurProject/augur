import BigNumber from "bignumber.js";

interface FieldWhitelist {
  [key: string]: boolean;
}

interface TableWhitelist {
  [className: string]: FieldWhitelist;
}

const whitelist: TableWhitelist = {
  crowdsourcers: {
    size: true,
    amountStaked: true,
  },
  disputes: {
    amountStaked: true,
  },
  markets: {
    numTicks: true,
    minPrice: true,
    maxPrice: true,
    creationFee: true,
    reportingFeeRate: true,
    marketCreatorFeeRate: true,
    marketCreatorFeesClaimed: true,
    marketCreatorFeesBalance: true,
    initialReportSize: true,
    volume: true,
    sharesOutstanding: true,
    designatedReportStake: true,
  },
  orders: {
    price: true,
    amount: true,
    fullPrecisionAmount: true,
    fullPrecisionPrice: true,
    tokensEscrowed: true,
    sharesEscrowed: true,
  },
  balances: {
    balance: true,
  },
  approvals: {
    value: true,
  },
  transfers: {
    value: true,
  },
  trades: {
    numCreatorTokens: true,
    numCreatorShares: true,
    numFillerTokens: true,
    numFillerShares: true,
    reporterFees: true,
    marketCreatorFees: true,
    price: true,
    amount: true,
  },
  outcomes: {
    price: true,
    volume: true,
  },
  payouts: {
    payout0: true,
    payout1: true,
    payout2: true,
    payout3: true,
    payout4: true,
    payout5: true,
    payout6: true,
    payout7: true,
    payout8: true,
  },
  positions: {
    numShares: true,
    numSharesAdjustedForUserIntention: true,
    realizedProfitLoss: true,
    unrealizedProfitLoss: true,
    averagePrice: true,
  },
  initial_reports: {
    amountStaked: true,
  },
  fee_windows: {
    fees: true,
  },
  token_supply: {
    supply: true,
    participationTokenStake: true,
  },
  trading_proceeds: {
    numShares: true,
    numPayoutTokens: true,
  },
};

const FIELD_NAMES: FieldWhitelist = (() => {
  // xMySorterFieldx is a magic value used for auto-ordering by big
  // number
  const namesonly: FieldWhitelist = {xMySorterFieldx: true};
  for (const key in whitelist) {
    if (whitelist.hasOwnProperty(key)) {
      Object.assign(namesonly, whitelist[key]);
    }
  }
  return namesonly;
})();

export function isFieldBigNumber(fieldName: string): boolean {
  return FIELD_NAMES[fieldName];
}

// We're converting these values in place isntead of cloning the whole object
function convertToBigNumber(row: any) {
  if (row === null || typeof row !== "object") return row;

  for (const key in row) {
    if (row.hasOwnProperty(key) && isFieldBigNumber(key) && typeof row[key] === "string") {
      row[key] = new BigNumber(row[key], 10);
    }
  }

  return row;
}

export function postProcessDatabaseResults(result: Array<any>|any) {
  if (Array.isArray(result)) {
    return result.map(convertToBigNumber);
  } else {
    return convertToBigNumber(result);
  }
}
