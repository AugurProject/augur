/**
 * Created by paul on 9/6/16.
 */

import { makeABCUIContext } from 'airbitz-core-js-ui';

const a = makeABCUIContext({
	apiKey: 'd98e26ce95d1a1ceb76be0f373fd2b1af29335e8',
	accountType: 'account:repo:com.augur',
	vendorName: 'Augur'
});

export default function () {
	return a
}
