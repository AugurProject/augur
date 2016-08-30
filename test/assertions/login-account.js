import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';

export default function(loginAccount) {
	assert.isDefined(loginAccount, `loginAccount isn't defined`);
	assert.isObject(loginAccount, `loginAccount isn't an object`);

	assert.isDefined(loginAccount.id, `loginAccount.id isn't defined`);
	assert.isString(loginAccount.id, `loginAccount.id isn't a string`);

	assert.isDefined(loginAccount.name, `loginAccount.name isn't defined`);
	assert.isString(loginAccount.name, `loginAccount.name isn't a string`);

	assert.isDefined(loginAccount.linkText, `loginAccount.linkText isn't defined`);
	assert.isString(loginAccount.linkText, `loginAccount.linkText isn't a string`);

	assert.isDefined(loginAccount.secureLoginID, `loginAccount.secureLoginID isn't defined`);
	assert.isString(loginAccount.secureLoginID, `loginAccount.secureLoginID isn't a string`);

	assert.isDefined(loginAccount.prettySecureLoginID, `loginAccount.prettySecureLoginID isn't defined`);
	assert.isString(loginAccount.prettySecureLoginID, `loginAccount.prettySecureLoginID isn't a string`);

	assert.isDefined(loginAccount.prettyAddress, `loginAccount.prettyAddress isn't defined`);
	assert.isString(loginAccount.prettyAddress, `loginAccount.prettyAddress isn't a string`);

	assert.isDefined(loginAccount.localNode, `loginAccount.localNode isn't defined`);
	assert.isBoolean(loginAccount.localNode, `loginAccount.localNode isn't a boolean`);

	assertFormattedNumber(loginAccount.rep, 'loginAccount.rep');
	assertFormattedNumber(loginAccount.ether, 'loginAccount.ether');
	assertFormattedNumber(loginAccount.realEther, 'loginAccount.realEther');
}
