import {
  AddLiquidityCall,
  RemoveLiquidityCall,
  SwapCall,
} from '../../generated/templates/AMMExchange/AMMExchange';
import { getOrCreateAMMExchange } from '../utils/helpers';

export function handleAddLiquidity(call: AddLiquidityCall) {

}

export function handleRemoveLiquidity(call: RemoveLiquidityCall) {

}

// Volume = tokens * cash
export function handleSwap(call: SwapCall) {
  let ammExchange = getOrCreateAMMExchange(call.to);
  let outputShares = call.outputs.value0;

  ammExchange.liquidity = ammExchange.liquidity.plus(outputShares);
  ammExchange.save();
}
