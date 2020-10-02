import {
  EnterPosition as EnterPositionEvent,
  ExitPosition as ExitPositionEvent,
  SwapPosition as SwapPositionEvent,
} from '../../generated/templates/AMMExchange/AMMExchange';
import {
  AddLiquidityCall,
  RemoveLiquidityCall,
} from '../../generated/templates/AMMExchange/AMMExchange';

export function handleAddLiquidity(call: AddLiquidityCall) {

}

export function handleRemoveLiquidity(call: RemoveLiquidityCall) {

}

// Volume = tokens * cash
export function handleEnterPosition(event: EnterPositionEvent) {

}

export function handleExitPosition(event: ExitPositionEvent) {

}

export function handleSwapPosition(event: SwapPositionEvent) {

}
