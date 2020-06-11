import { formatEthereumAddress } from '@augurproject/utils';

export const getTradePageMarketId = () => {
  const idEtc = document.location.hash.split('id=');
  if (idEtc.length <= 1) return false;
  // remove url pieces unrelated to market id
  const addr = idEtc[idEtc.length - 1].split('&')[0];
  return formatEthereumAddress(addr);
};
