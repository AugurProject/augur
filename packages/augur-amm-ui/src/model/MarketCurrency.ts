import { JSBI, Token, TokenAmount } from "@uniswap/sdk";

export class MarketCurrency extends TokenAmount {
  readonly marketId: string;
  readonly cash: string;
  readonly amm: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly name: string;

  constructor(marketId: string, cash: string, amm: string, token: Token, amount: string) {
    super(token, JSBI.BigInt(amount))
    this.marketId = marketId;
    this.cash = cash;
    this.amm = amm;
    this.decimals = token.decimals
    this.symbol = token.symbol
    this.name = token.name
  }
}
