import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { AMMCreated } from '../../generated/AMMFactory/AMMFactory';
import { AMMExchange, ParaShareToken, BPool } from '../../generated/schema';
import { AMMExchange as AMMExchangeTemplate, BPool as BPoolTemplate  } from '../../generated/templates';
import { updateAMM } from '../utils/helpers/amm';
import {updateOrCreateBPool} from './bPool';

export function handleAMMCreated(event: AMMCreated): void {
  let id = event.params.amm.toHexString();
  let shareTokenId = event.params.shareToken.toHexString();
  let paraShareToken = ParaShareToken.load(shareTokenId);
  let fee = event.params.fee;

  // The amm belongs to another para deploy.
  if(paraShareToken == null) {
    return;
  }

  updateOrCreateBPool(event.params.bPool.toHexString());
  BPoolTemplate.create(event.params.bPool);

  let ZERO = BigDecimal.fromString('0');
  let amm = new AMMExchange(id);
  amm.cashBalance = BigInt.fromI32(0);
  amm.market = event.params.market.toHexString();
  amm.shareToken = shareTokenId;
  amm.invalidPool = event.params.bPool.toHexString();
  amm.cash = paraShareToken.cash;
  amm.fee = fee;
  amm.feePercent = fee.divDecimal(BigInt.fromI32(100).toBigDecimal());
  amm.liquidity = ZERO;
  amm.liquidityInvalid = ZERO;
  amm.liquidityNo = ZERO;
  amm.liquidityYes = ZERO;
  amm.percentageNo = ZERO;
  amm.percentageYes = ZERO;
  amm.totalSupply =  BigInt.fromI32(0);
  amm.symbols = event.params._symbols;
  amm.volumeNo = ZERO;
  amm.volumeYes = ZERO;

  AMMExchangeTemplate.create(Address.fromString(id));

  amm.save();

  updateAMM(id);
}
