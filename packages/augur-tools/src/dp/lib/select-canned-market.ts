import {cannedMarketsData} from "../data/canned-markets";

export function selectCannedMarket(description, marketType) {
  return cannedMarketsData.find(cannedMarketData => cannedMarketData._description === description && cannedMarketData.marketType === marketType);
}
