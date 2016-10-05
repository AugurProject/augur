/**
 * Created by paul on 9/6/16.
 */

import { makeABCUIContext } from 'airbitz-core-js-ui';

const a = makeABCUIContext({
	apiKey: 'e239ec875955ec7474628a1dc3d449c8ea8e1b48',
	accountType: 'account:repo:com.augur',
	vendorName: 'Augur',
	vendorImageUrl: 'https://airbitz.co/go/wp-content/uploads/2016/08/augur_logo_100.png'
});

export default function () {
	return a;
}
