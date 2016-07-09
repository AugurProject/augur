import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';

export default function(loginAccount) {
	assert.isDefined(loginAccount, `loginAccount isn't defined`);
	assert.isObject(loginAccount, `loginAccount isn't an object`);

	assert.isDefined(loginAccount.id, `loginAccount.id isn't defined`);
	assert.isString(loginAccount.id, `loginAccount.id isn't a string`);

	assert.isDefined(loginAccount.handle, `loginAccount.handle isn't defined`);
	assert.isString(loginAccount.handle, `loginAccount.handle isn't a string`);

	assertFormattedNumber(loginAccount.rep, 'loginAccount.rep');
	assertFormattedNumber(loginAccount.ether, 'loginAccount.ether');
	assertFormattedNumber(loginAccount.realEther, 'loginAccount.realEther');
}
