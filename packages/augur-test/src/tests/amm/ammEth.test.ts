import BigNumber from 'bignumber.js';

import {TestContractAPI, ACCOUNTS, defaultSeedPath, loadSeed} from '@augurproject/tools';
import {
  SDKConfiguration,
} from '@augurproject/utils';

import {AMM} from '@augurproject/sdk-lite';
import {makeProvider} from '../../libs';
import {ContractInterfaces} from '@augurproject/core';


describe('AMM Middleware for ETH', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;
  let config: SDKConfiguration;
  let wethParaShare: ContractInterfaces.ParaShareToken;

  let market: ContractInterfaces.Market;
  let INVALID: BigNumber;
  let NO: BigNumber;
  let YES: BigNumber;
  let numTicks;
  let marketCreatorFeeDivisor;

  const INCLUDE_FEE = true;
  const EXCLUDE_FEE = false;
  const SYMBOL_ROOT = 'symbol';
  const SYMBOLS = [
    `i${SYMBOL_ROOT}`,
    `n${SYMBOL_ROOT}`,
    `y${SYMBOL_ROOT}`
  ];

  const ONE_ETH = bn(1000).times(1e18); // 1000 ETH

  function makeAMMMiddleware(user: TestContractAPI): AMM {
    const wethParaShareTokenAddress = config?.paraDeploys[config.addresses.WETH9]?.addresses.ShareToken;
    return new AMM(user.signer, wethParaShareTokenAddress, config.addresses.AMMFactory, config.addresses.WethWrapperForAMMExchange);
  }

  function makeWETHParaShareToken(user: TestContractAPI): ContractInterfaces.ParaShareToken {
    const wethParaShareAddress = config.paraDeploys[config.addresses.WETH9].addresses.ShareToken;
    return new ContractInterfaces.ParaShareToken(user.dependencies, wethParaShareAddress);
  }

  function makeParaUniverse(user: TestContractAPI): ContractInterfaces.ParaUniverse {
    const address = config.paraDeploys[config.addresses.WETH9].addresses.Universe;
    return new ContractInterfaces.ParaUniverse(user.dependencies, address);
  }

  async function getReportingFee(): Promise<BigNumber> {
    return makeParaUniverse(john).getOrCacheReportingFeeDivisor_(); // since not executed, will not update cache
  }

  function makeExchange(user: TestContractAPI, market): ContractInterfaces.AMMExchange {
    const address = config.addresses.WethWrapperForAMMExchange;
    return new ContractInterfaces.AMMExchange(user.dependencies, address);
  }

  function bn(n: string | number | BigNumber): BigNumber {
    return new BigNumber(n);
  }

  beforeAll(async () => {
    const seed = await loadSeed(defaultSeedPath, 'paras');
    const provider = await makeProvider(seed, ACCOUNTS);
    config = provider.getConfig();

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      config
    );
    mary = await TestContractAPI.userWrapper(
      ACCOUNTS[1],
      provider,
      config
    );
    bob = await TestContractAPI.userWrapper(
      ACCOUNTS[2],
      provider,
      config
    );

    wethParaShare = makeWETHParaShareToken(bob);

    market = await john.createReasonableYesNoMarket();
    INVALID = await wethParaShare.getTokenId_(market.address, bn(0));
    NO = await wethParaShare.getTokenId_(market.address, bn(1));
    YES = await wethParaShare.getTokenId_(market.address, bn(2));
    numTicks = await market.getNumTicks_();
    marketCreatorFeeDivisor = await market.getMarketCreatorSettlementFeeDivisor_();
  });

  describe('getAddLiquidity method', () => {
    let middleware;
    let ONE_ETH_DIV_BY_NUMTICKS;
    beforeAll(async () => {
      middleware = makeAMMMiddleware(mary);
      ONE_ETH_DIV_BY_NUMTICKS = ONE_ETH.idiv(numTicks);
    });

    test('initial liquidity', async () => {
      const longPercent = bn(50);
      const shortPercent = bn(100).minus(longPercent);

      const result = await middleware.getAddLiquidity(
        bn(0),
        bn(0),
        bn(0),
        ONE_ETH,
        longPercent,
        shortPercent
      );

      expect(result).toEqual({
        cash: ONE_ETH,
        long:  bn(0),
        lpTokens: ONE_ETH_DIV_BY_NUMTICKS,
        short:  bn(0)
      });
    });

    test('existing liquidity', async () => {
      const longPercent = bn(50);
      const shortPercent = bn(100).minus(longPercent);

      // no swapping has happened.
      const result = await middleware.getAddLiquidity(
        ONE_ETH_DIV_BY_NUMTICKS,
        ONE_ETH_DIV_BY_NUMTICKS,
        ONE_ETH_DIV_BY_NUMTICKS,
        ONE_ETH,
        longPercent,
        shortPercent
      );

      expect(result).toEqual({
        cash: ONE_ETH,
        long: bn(0),
        lpTokens: ONE_ETH_DIV_BY_NUMTICKS,
        short: bn(0)
      });
    });
  });

  describe('with a simple liquid AMM', () => {
    const fee = bn(10); // 1%

    beforeAll(async () => {
      const longPercent = bn(50);
      const shortPercent = bn(100).minus(longPercent);

      const middleware = makeAMMMiddleware(mary);

      console.log('Create AMM with initial liquidity');
      await middleware.doAddLiquidity(
        mary.account.address,
        undefined,
        false,
        market.address,
        wethParaShare.address,
        fee,
        ONE_ETH,
        longPercent,
        shortPercent,
        SYMBOL_ROOT,
      );
    });

    test('amm exists', async () => {
      const middleware = makeAMMMiddleware(mary);
      const registeredAddress = await middleware.exchangeAddress(market.address, wethParaShare.address, fee);
      const calculatedAddress = await middleware.calculateExchangeAddress(market.address, wethParaShare.address, fee);
      expect(registeredAddress).toEqual(calculatedAddress);
    })

    test('liquidity minted lp tokens', async () => {
      const middleware = makeAMMMiddleware(mary);
      console.log('Verify the LP token supply');
      const expectedLPTokens = ONE_ETH.idiv(numTicks);
      const actualLPTokens = await middleware.supplyOfLiquidityTokens(market.address, wethParaShare.address, fee);
      expect(actualLPTokens).toEqual(expectedLPTokens);

      console.log('Verify that the LP tokens are held by Mary');
      const actuallyHeldLPTokens = await middleware.liquidityTokenBalance(market.address, wethParaShare.address, fee, mary.account.address);
      expect(actuallyHeldLPTokens).toEqual(expectedLPTokens); // mary has all of the LP tokens
    })

    test('enter position', async () => {
      const middleware = makeAMMMiddleware(bob);
      const cash = bn(10).times(1e18); // 10 ETH
      const buyLong = true;

      console.log('Estimating position being entered');
      const withFee = await middleware.getEnterPosition(market.address, wethParaShare.address, fee, cash, buyLong, INCLUDE_FEE);
      const withoutFee = await middleware.getEnterPosition(market.address, wethParaShare.address, fee, cash, buyLong, EXCLUDE_FEE);

      console.log('Verifying that no-fee estimation is correct relative to fee estimation.');
      const mintedShares = cash.idiv(numTicks);
      expect(withFee.toNumber()).toEqual(withoutFee.minus(mintedShares).times(0.99).plus(mintedShares).toNumber());

      console.log('Verifying that the entry estimation is correct, to a hardcoded value')
      expect(withoutFee.toNumber()).toEqual(19900990099009900);

      console.log('Entering position');
      await middleware.doEnterPosition(market.address, wethParaShare.address, fee, cash, buyLong, withFee);

      const invalid = await wethParaShare.balanceOf_(bob.account.address, INVALID);
      const no = await wethParaShare.balanceOf_(bob.account.address, NO);
      const yes = await wethParaShare.balanceOf_(bob.account.address, YES);

      console.log('Verifying entered position');
      expect(invalid.toNumber()).toEqual(no.toNumber());
      expect(invalid.toNumber()).toEqual(0);
      expect(yes.toNumber()).toEqual(withFee.toNumber());
    });

    test('exit position', async () => {
      const middleware = makeAMMMiddleware(bob);

      const ammAddress = await middleware.exchangeAddress(market.address, wethParaShare.address, fee);
      const totalSupply = await middleware.supplyOfLiquidityTokens(market.address, wethParaShare.address, fee);
      const [ noShares, yesShares]  = await wethParaShare.balanceOfBatch_([
        ammAddress,
        ammAddress,
        ],
        [
          NO,
          YES
        ]);

      const longShares = await wethParaShare.balanceOf_(bob.account.address, YES); // from enter position test

      console.log('Estimating exit position rate');
      const sharesToExit = longShares.idiv(4);
      const reportingFee = await getReportingFee();
      const withFee = await middleware.getExitPosition(totalSupply, noShares, yesShares, fee, bn(0), sharesToExit, INCLUDE_FEE, marketCreatorFeeDivisor, reportingFee)
      const withoutFee = await middleware.getExitPosition(totalSupply, noShares, yesShares, fee, bn(0), sharesToExit, EXCLUDE_FEE, marketCreatorFeeDivisor, reportingFee)

      console.log('Verifying that no-fee estimation is correct relative to fee estimation.');
      // Approximating because exact calculation is complicated: involves swapped vs kept shares and market creator and reporting fees
      expect(withFee.toNumber()).toBeLessThan(withoutFee.times(0.99).toNumber());
      expect(withFee.toNumber()).toBeGreaterThan(withoutFee.times(0.928).toNumber());

      console.log('Approving Wrapper to use WETH ParaShareTokens for Bob');
      await wethParaShare.setApprovalForAll(config.addresses.WethWrapperForAMMExchange, true); // note that Bob is the actor here

      const priorEth = await bob.getEthBalance();

      console.log('Exiting 1/4th of position');
      await middleware.doExitPosition(market.address, wethParaShare.address, fee, bn(0), sharesToExit, withFee);

      const invalid = await wethParaShare.balanceOf_(bob.account.address, INVALID);
      const no = await wethParaShare.balanceOf_(bob.account.address, NO);
      const yes = await wethParaShare.balanceOf_(bob.account.address, YES);
      const eth = await bob.getEthBalance();

      console.log('Verifying exited position');
      expect(eth.toNumber()).toBeGreaterThan(priorEth.toNumber()); // gas fees complicate calc so just, user should've gained some ETH from exiting
      expect(invalid.toNumber()).toEqual(no.toNumber());
      expect(invalid.toNumber()).toEqual(0);
      expect(yes.toNumber()).toEqual(longShares.minus(sharesToExit).toNumber());
    });

    test('swap', async () => {
      const middleware = makeAMMMiddleware(bob);
      const BUY_SHORT = false;
      const longShares = await wethParaShare.balanceOf_(bob.account.address, YES);
      const swapAway = longShares.idiv(2);

      console.log('Estimating swap of half Long shares for Short shares');
      const withFee = await middleware.getSwap(market.address, wethParaShare.address, fee, swapAway, BUY_SHORT, INCLUDE_FEE);
      const withoutFee = await middleware.getSwap(market.address, wethParaShare.address, fee, swapAway, BUY_SHORT, EXCLUDE_FEE);

      console.log('Verifying that no-fee estimation is correct relative to fee estimation.');
      expect(withFee.toNumber()).toEqual(withoutFee.times(bn(1000).minus(fee)).idiv(bn(1000)).toNumber());

      console.log('Approving AMM Factory to use WETH ParaShareTokens for Bob');
      await wethParaShare.setApprovalForAll(config.addresses.AMMFactory, true); // note that Bob is the actor here

      console.log('Swapping Long for Short');
      await middleware.doSwap(market.address, wethParaShare.address, fee, swapAway, BUY_SHORT, withFee);

      const invalid = await wethParaShare.balanceOf_(bob.account.address, INVALID);
      const no = await wethParaShare.balanceOf_(bob.account.address, NO);
      const yes = await wethParaShare.balanceOf_(bob.account.address, YES);

      console.log('Verifying swapped positions');
      expect(invalid.toNumber()).toEqual(no.toNumber());
      expect(invalid.toNumber()).toEqual(withFee.toNumber());
      expect(yes.toNumber()).toEqual(longShares.minus(swapAway).toNumber());
    });

    test('remove liquidity', async () => {
      const middleware = makeAMMMiddleware(mary);

      const lpTokens = await middleware.liquidityTokenBalance(market.address, wethParaShare.address, fee, mary.account.address);
      const lpTokensToBurn = lpTokens.idiv(3);

      console.log('Approving wrapper to spend LP tokens');
      await middleware.approveSpendingOfLiquidityTokens(market.address, wethParaShare.address, fee, config.addresses.WethWrapperForAMMExchange, bn(2).pow(256).minus(1));

      console.log('Estimating removeLiquidity gains, without swapping shares for complete sets then burning them');
      const dontSell = await middleware.getRemoveLiquidity(market.address, wethParaShare.address, fee, lpTokensToBurn);

      expect(dontSell).toEqual({
        short: bn('333374069166798453'),
        long: bn('333367511571361245'),
      });

      console.log('Selling 1/3rd of LP tokens via removeLiquidity, then selling the resulting shares');
      await middleware.doRemoveLiquidity(market.address, wethParaShare.address, fee, lpTokensToBurn, SYMBOLS);

      const postInvalid = await wethParaShare.balanceOf_(mary.account.address, INVALID);
      const postNo = await wethParaShare.balanceOf_(mary.account.address, NO);
      const postYes = await wethParaShare.balanceOf_(mary.account.address, YES);

      expect(postInvalid.toNumber()).toEqual(dontSell.short.toNumber());
      expect(postNo.toNumber()).toEqual(dontSell.short.toNumber());
      expect(postYes.toNumber()).toEqual(dontSell.long.toNumber());
    });

    test('remove all liquidity', async () => {
      const middleware = makeAMMMiddleware(mary);

      const lpTokens = await middleware.liquidityTokenBalance(market.address, wethParaShare.address, fee, mary.account.address);

      const priorInvalid = await wethParaShare.balanceOf_(mary.account.address, INVALID);
      const priorNo = await wethParaShare.balanceOf_(mary.account.address, NO);
      const priorYes = await wethParaShare.balanceOf_(mary.account.address, YES);

      const ammAddress = await middleware.exchangeAddress(market.address, wethParaShare.address, fee);
      const ammInvalid = await wethParaShare.balanceOf_(ammAddress, INVALID);
      const ammNo = await wethParaShare.balanceOf_(ammAddress, NO);
      const ammYes = await wethParaShare.balanceOf_(ammAddress, YES);

      console.log('Estimating removeLiquidity gains, with swapping shares for complete sets then burning them');
      const estimate = await middleware.getRemoveLiquidity(market.address, wethParaShare.address, fee, lpTokens);

      expect(estimate).toEqual({
        short: ammNo,
        long: ammYes,
      });

      console.log('Removing remaining liquidity without selling any received shares')
      await middleware.doRemoveLiquidity(market.address, wethParaShare.address, fee, lpTokens, SYMBOLS);

      const postInvalid = await wethParaShare.balanceOf_(mary.account.address, INVALID);
      const postNo = await wethParaShare.balanceOf_(mary.account.address, NO);
      const postYes = await wethParaShare.balanceOf_(mary.account.address, YES);

      expect(postInvalid.toNumber()).toEqual(priorInvalid.plus(ammInvalid).toNumber());
      expect(postNo.toNumber()).toEqual(priorNo.plus(ammNo).toNumber());
      expect(postYes.toNumber()).toEqual(priorYes.plus(ammYes).toNumber());
    });
  });
});
