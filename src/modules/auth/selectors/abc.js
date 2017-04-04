import { createSelector } from 'reselect';
import { makeABCUIContext } from 'airbitz-core-js-ui';
import store from 'src/store';

export default function () {
  return selectABCUIContext(store.getState());
}

export const selectABCUIContext = createSelector(
  () => makeABCUIContext({
    apiKey: 'e239ec875955ec7474628a1dc3d449c8ea8e1b48',
    appId: 'net.augur.app',
    vendorName: 'Augur',
    vendorImageUrl: 'https://airbitz.co/go/wp-content/uploads/2016/08/augur_logo_100.png'
  })
);
