/**
 * Created by paul on 9/6/16.
 */

import { makeABCUIContext } from 'airbitz-core-js-ui';

const a = makeABCUIContext({
	apiKey: '296e50ecc7b939d0c97bf62ea1ca6fbd0bc04bc1',
	accountType: 'account:repo:com.augur',
	vendorName: 'Augur'
});

export default function () {
	return a;
}
