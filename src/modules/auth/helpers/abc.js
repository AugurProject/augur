import { createSelector } from 'reselect';
import { makeABCUIContext } from 'airbitz-core-js-ui';
import store from 'src/store';

// NOTE -- I have a strong suspicion we can refactor this out to be clearer/cleaner, leaving for now

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
