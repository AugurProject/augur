export const UPDATE_NEW_MARKET = 'UPDATE_NEW_MARKET';
export const CLEAR_NEW_MARKET = 'CLEAR_NEW_MARKET';

export function updateNewMarket(data) {
  console.log('updateNewMarket -- ', data);
  return { type: UPDATE_NEW_MARKET, data };
}

export function clearNewMarket() {
  return { type: CLEAR_NEW_MARKET };
}
