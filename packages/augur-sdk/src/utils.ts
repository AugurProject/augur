export {
  compareObjects,
  calculatePayoutNumeratorsValue,
  calculatePayoutNumeratorsArray,
  getTradeInterval,
  isWellFormedYesNo,
  isWellFormedScalar,
  isWellFormedCategorical,
  logError,
  marketTypeToName,
  marketNameToType,
} from '@augurproject/sdk-lite';

export {
  padHex,
  ZERO,
  ONE,
  QUINTILLION,
  numTicksToTickSize,
  numTicksToTickSizeWithDisplayPrices,
  tickSizeToNumTickWithDisplayPrices,
  convertOnChainAmountToDisplayAmount,
  convertDisplayAmountToOnChainAmount,
  convertOnChainPriceToDisplayPrice,
  convertDisplayPriceToOnChainPrice,
  convertPayoutNumeratorsToStrings,
  convertDisplayValuetoAttoValue,
  convertAttoValueToDisplayValue
} from "@augurproject/utils";

import { OrderData, ZeroXOrders } from './state/db/ZeroXOrders';

export function parseZeroXMakerAssetData(makerAssetData: string): OrderData {
  const { orderData } = ZeroXOrders.parseAssetData(makerAssetData);
  return orderData;
}
