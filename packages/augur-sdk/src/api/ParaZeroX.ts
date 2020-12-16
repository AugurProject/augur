import { BigNumber } from 'bignumber.js';
import { QUINTILLION } from '../utils';
import { MAX_PROTOCOL_FEE_MULTIPLIER, ZeroX } from './ZeroX';

export class ParaZeroX extends ZeroX {
  async batchCancelOrders(orders, signatures) {
    if (!this.client) throw new Error('To cancel ZeroX orders, make sure your Augur Client instance was initialized with it enabled.');

    const gasPrice = await this.client.getGasPrice();
    const exchangeFeeMultiplier = await this.client.contracts.zeroXExchange.protocolFeeMultiplier_();
    let protocolFee = gasPrice.multipliedBy(exchangeFeeMultiplier).multipliedBy(orders.length);
    let attachedEth = undefined;

    if (this.client.config.paraDeploy) {
      const walletEthBalance = await this.client.getEthBalance(await this.client.getAccount());
      attachedEth = BigNumber.min(protocolFee, walletEthBalance);
      protocolFee = protocolFee.gt(walletEthBalance) ? protocolFee.minus(walletEthBalance) : new BigNumber(0);
    }

    const maxProtocolFeeInDai = protocolFee.multipliedBy(await this.client.getExchangeRate(true)).multipliedBy(MAX_PROTOCOL_FEE_MULTIPLIER).div(QUINTILLION).decimalPlaces(0);

    return this.client.contracts.getZeroXTrade().cancelOrders(orders, signatures, maxProtocolFeeInDai, { attachedEth });
  }
}
