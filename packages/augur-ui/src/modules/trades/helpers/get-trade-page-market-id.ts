import { formatEthereumAddress } from '@augurproject/utils';
import parseQuery from 'modules/routes/helpers/parse-query';

export const getTradePageMarketId = () => {
  const [, search] = document.location.hash.split('?');
  const query = parseQuery(search);
  const addr = query['id'];
  return formatEthereumAddress(addr);
};
