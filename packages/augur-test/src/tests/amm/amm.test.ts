import BigNumber from 'bignumber.js';

import {TestContractAPI, ACCOUNTS, defaultSeedPath, loadSeed, makeSigner} from '@augurproject/tools';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  numTicksToTickSize,
  numTicksToTickSizeWithDisplayPrices,
  SDKConfiguration,
} from '@augurproject/utils';

import {AMM} from '@augurproject/sdk-lite';
import {makeProvider} from '../../libs';
import {ContractInterfaces} from '@augurproject/core';


describe('AMM Middleware', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let config: SDKConfiguration;
  let market: ContractInterfaces.Market;

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

    market = await john.createReasonableYesNoMarket();
  });

  async function makeAMMMiddleware(user: TestContractAPI): Promise<AMM> {
    const wethParaShareTokenAddress = config?.paraDeploys[config.addresses.WETH9]?.addresses.ShareToken;
    console.log("MARINA_signer", user.signer)
    return new AMM(user.signer, wethParaShareTokenAddress, config.addresses.AMMFactory, config.addresses.WETH9);
  }

  test('new amm with liquidity mints lp tokens', async () => {
    const usdtParaShare = config.paraDeploys[config.addresses.USDT].addresses.ShareToken;
    const fee = new BigNumber(10); // 1%
    const initialLiquidity = new BigNumber(1000).times(1e6); // 1000 USDT
    const yesPercent = new BigNumber(50);
    const nopercent = new BigNumber(100).minus(yesPercent);

    await mary.faucetUSDT(initialLiquidity);
    await mary.approveUSDT(config.addresses.AMMFactory);

    const middleware = await makeAMMMiddleware(mary);

    console.log('Create AMM with initial liquidity');
    await middleware.doAddLiquidity(
      mary.account.address,
      undefined,
      false,
      market.address,
      usdtParaShare,
      fee,
      initialLiquidity,
      yesPercent,
      nopercent,
    );

    console.log('Verify the LP tokens');
    const expectedLPTokens = initialLiquidity.idiv(await market.getNumTicks_());
    const actualLPTokens = await middleware.supplyOfLiquidityTokens(market.address, usdtParaShare, fee);
    expect(actualLPTokens).toEqual(expectedLPTokens);

    const actuallyHeldLPTokens = await middleware.liquidityTokenBalance(market.address, usdtParaShare, fee, mary.account.address);
    expect(actuallyHeldLPTokens).toEqual(expectedLPTokens); // mary has all of the LP tokens
  });

});
