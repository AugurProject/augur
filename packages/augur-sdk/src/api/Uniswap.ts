import { NULL_ADDRESS } from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import { Augur } from '../Augur';

const SECONDS_FROM_NOW_DEADLINE = 3600; // An hour

export class Uniswap {
  constructor(private readonly augur: Augur) {}

  /**
   * @desc Adds liquidity to a normal token exchange
   * @param {string} token0 the first token address
   * @param {string} token1 the second token address
   * @returns {Promise<void>}
   */
  async addLiquidity(
    token0: string,
    token1: string,
    amount0Desired: BigNumber,
    amount1Desired: BigNumber,
    amount0Min: BigNumber,
    amount1Min: BigNumber
  ): Promise<void> {
    const account = await this.augur.getAccount();
    const deadline = new BigNumber(Date.now() + SECONDS_FROM_NOW_DEADLINE);
    await this.augur.contracts.uniswap.addLiquidity(
      token0,
      token1,
      amount0Desired,
      amount1Desired,
      amount0Min,
      amount1Min,
      account,
      deadline
    );
  }

  /**
   * @desc Swaps a maximum number of tokens in exchange for an exact number of tokens
   * @param {string} token0 the exact-value token address
   * @param {string} token1 the max-value token address
   * @param {BigNumber} maxToken0Amount the maximum amount of token0 tokens in
   * @param {BigNumber} exactToken1Amount the exact amount of token1 tokens to be received
   * @returns {Promise<void>}
   */
  async swapTokensForExactTokens(
    token0: string,
    token1: string,
    maxToken0Amount: BigNumber,
    exactToken1Amount: BigNumber
  ): Promise<void> {
    const account = await this.augur.getAccount();
    const deadline = new BigNumber(Date.now() + SECONDS_FROM_NOW_DEADLINE);
    await this.augur.contracts.uniswap.swapTokensForExactTokens(
      exactToken1Amount,
      maxToken0Amount,
      [token0, token1],
      account,
      deadline
    );
  }

  /**
   * @desc Swaps an exact number of tokens in exchange for a minimum number of tokens
   * @param {string} token0 the exact-value token address
   * @param {string} token1 the min-value token address
   * @param {BigNumber} exactToken0Amount the exact amount of token0 tokens in
   * @param {BigNumber} minToken1Amount the minimum amount of token1 tokens to be received
   * @returns {Promise<void>}
   */
  async swapExactTokensForTokens(
    token0: string,
    token1: string,
    exactToken0Amount: BigNumber,
    minToken1Amount: BigNumber
  ): Promise<void> {
    const account = await this.augur.getAccount();
    const deadline = new BigNumber(Date.now() + SECONDS_FROM_NOW_DEADLINE);
    await this.augur.contracts.uniswap.swapExactTokensForTokens(
      exactToken0Amount,
      minToken1Amount,
      [token0, token1],
      account,
      deadline
    );
  }

  /**
   * @desc Swaps an maximum number of tokens in exchange for an exact amount of ETH
   * @param {string} token the token address
   * @param {BigNumber} maxTokenAmount the maximum amount of tokens in
   * @param {BigNumber} exactETHAmount the exact amount of ETH to be received
   * @returns {Promise<void>}
   */
  async swapTokensForExactETH(
    token: string,
    maxTokenAmount: BigNumber,
    exactETHAmount: BigNumber
  ): Promise<void> {
    const account = await this.augur.getAccount();
    const wethAddress = this.augur.contracts.weth.address;
    const deadline = new BigNumber(Date.now() + SECONDS_FROM_NOW_DEADLINE);
    await this.augur.contracts.uniswap.swapTokensForExactETH(
      exactETHAmount,
      maxTokenAmount,
      [token, wethAddress],
      account,
      deadline
    );
  }

  /**
   * @desc Swaps an exact number of tokens in exchange for a minimum amount of ETH
   * @param {string} token the token address
   * @param {BigNumber} exactTokenAmount the exact amount of tokens in
   * @param {BigNumber} minETHAmount the minimum amount of ETH to be received
   * @returns {Promise<void>}
   */
  async swapExactTokensForETH(
    token: string,
    exactTokenAmount: BigNumber,
    minETHAmount: BigNumber
  ): Promise<void> {
    const account = await this.augur.getAccount();
    const wethAddress = this.augur.contracts.weth.address;
    const deadline = new BigNumber(Date.now() + SECONDS_FROM_NOW_DEADLINE);
    await this.augur.contracts.uniswap.swapExactTokensForETH(
      exactTokenAmount,
      minETHAmount,
      [token, wethAddress],
      account,
      deadline
    );
  }

  /**
   * @desc Swaps a maximum amount of ETH in exchange for an exact amount of tokens
   * @param {string} token the token address
   * @param {BigNumber} exactTokenAmount the exact amount of tokens to be recieved
   * @param {BigNumber} maxETHAmount the maximum amount of ETH to be spent
   * @returns {Promise<void>}
   */
  async swapETHForExactTokens(
    token: string,
    exactTokenAmount: BigNumber,
    maxETHAmount: BigNumber
  ): Promise<void> {
    const account = await this.augur.getAccount();
    const wethAddress = this.augur.contracts.weth.address;
    const deadline = new BigNumber(Date.now() + SECONDS_FROM_NOW_DEADLINE);
    await this.augur.contracts.uniswap.swapETHForExactTokens(
      exactTokenAmount,
      [wethAddress, token],
      account,
      deadline,
      { attachedEth: maxETHAmount }
    );
  }

  /**
   * @desc Gives the exchange rate for two tokens in terms of the proceeds in terms of token0 for the sale of 1 token0
   * @param {string} token0 the first token address
   * @param {string} token1 the second token address
   * @returns {Promise<BigNumber>}
   */
  async getExchangeRate(token0: string, token1: string): Promise<BigNumber> {
    const exchangeAddress = await this.augur.contracts.uniswapV2Factory.getPair_(
      token0,
      token1
    );
    if (exchangeAddress === NULL_ADDRESS) {
      throw new Error('Exchange does not exist');
    }
    const exchange = this.augur.contracts.uniswapExchangeFromAddress(
      exchangeAddress
    );
    const realToken0 = await exchange.token0_();
    const reserves = await exchange.getReserves_();
    if (realToken0 === token0) {
      return reserves[0].div(reserves[1]);
    } else {
      return reserves[1].div(reserves[0]);
    }
  }
}
