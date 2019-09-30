import { formatEthereumAddress } from "@augurproject/utils";

export const getTradePageMarketId = () => {
  const locationHash = document.location.hash.split("id=");
  if (locationHash.length <= 1) return false;
  return formatEthereumAddress(locationHash[locationHash.length - 1]);
};
