var assert = require('chai').assert;
// loginAccount:
//  { id: String,
//    prettySecureLoginID: String,
//    linkText: String,
//    rep:
//     { value: Number,
//       formattedValue: Number,
//       formatted: String,
//       rounded: String,
//       minimized: String,
//       full: String,
//       denomination: 'rep' },
//    ether:
//     { value: Number,
//       formattedValue: Number,
//       formatted: String,
//       rounded: String,
//       minimized: String,
//       full: String,
//       denomination: 'eth' },
//    realEther:
//     { value: Number,
//       formattedValue: Number,
//       formatted: String,
//       rounded: String,
//       minimized: String,
//       full: String,
//       denomination: 'eth' } },
function loginAccountAssertion(actual) {
	// loginAccount overall
	assert.isDefined(actual, `loginAccount isn't defined`);
	assert.isObject(actual, `loginAccount isn't an object`);

	// loginAccount.id
	assert.isDefined(actual.id, `loginAccount.id isn't defined`);
	assert.isString(actual.id, `loginAccount.id isn't a string`);

	// loginAccount.linkText
	assert.isDefined(actual.linkText, `loginAccount.linkText isn't defined`);
	assert.isString(actual.linkText, `loginAccount.linkText isn't a string`);

	// loginAccount.prettySecureLoginID
	assert.isDefined(actual.prettySecureLoginID, `loginAccount.prettySecureLoginID isn't defined`);
	assert.isString(actual.prettySecureLoginID, `loginAccount.prettySecureLoginID isn't a string`);

	// loginAccount.rep
	assert.isDefined(actual.rep, `loginAccount.rep isn't defined`);
	assert.isObject(actual.rep , `loginAccount.rep isn't an object`);
	assert.isDefined(actual.rep.value, `loginAccount.rep.value isn't defined`);
	assert.isNumber(actual.rep.value, `loginAccount.rep.value isn't a number`);
	assert.isDefined(actual.rep.formattedValue, `loginAccount.rep.formattedValue isn't defined`);
	assert.isNumber(actual.rep.formattedValue, `loginAccount.rep.formattedValue isn't a number`);
	assert.isDefined(actual.rep.formatted, `loginAccount.rep.formatted isn't defined`);
	assert.isString(actual.rep.formatted, `loginAccount.rep.formatted isn't a string`);
	assert.isDefined(actual.rep.rounded, `loginAccount.rep.rounded isn't defined`);
	assert.isString(actual.rep.rounded, `loginAccount.rep.rounded isn't a string`);
	assert.isDefined(actual.rep.minimized, `loginAccount.rep.minimized isn't defined`);
	assert.isString(actual.rep.minimized, `loginAccount.rep.minimized isn't a string`);
	assert.isDefined(actual.rep.full, `loginAccount.rep.full isn't defined`);
	assert.isString(actual.rep.full, `loginAccount.rep.full isn't a string`);
	assert.isDefined(actual.rep.denomination, `loginAccount.rep.denomination isn't defined`);
	assert.isString(actual.rep.denomination, `loginAccount.rep.denomination isn't a string`);
	// assert.equal(actual.rep.denomination, 'rep', `loginAccount.rep.denomination isn't 'rep'`);

	// loginAccount.ether
	assert.isDefined(actual.ether, `loginAccount.ether isn't defined`);
	assert.isObject(actual.ether , `loginAccount.ether isn't an object`);
	assert.isDefined(actual.ether.value, `loginAccount.ether.value isn't defined`);
	assert.isNumber(actual.ether.value, `loginAccount.ether.value isn't a number`);
	assert.isDefined(actual.ether.formattedValue, `loginAccount.ether.formattedValue isn't defined`);
	assert.isNumber(actual.ether.formattedValue, `loginAccount.ether.formattedValue isn't a number`);
	assert.isDefined(actual.ether.formatted, `loginAccount.ether.formatted isn't defined`);
	assert.isString(actual.ether.formatted, `loginAccount.ether.formatted isn't a string`);
	assert.isDefined(actual.ether.rounded, `loginAccount.ether.rounded isn't defined`);
	assert.isString(actual.ether.rounded, `loginAccount.ether.rounded isn't a string`);
	assert.isDefined(actual.ether.minimized, `loginAccount.ether.minimized isn't defined`);
	assert.isString(actual.ether.minimized, `loginAccount.ether.minimized isn't a string`);
	assert.isDefined(actual.ether.full, `loginAccount.ether.full isn't defined`);
	assert.isString(actual.ether.full, `loginAccount.ether.full isn't a string`);
	assert.isDefined(actual.ether.denomination, `loginAccount.ether.denomination isn't defined`);
	assert.isString(actual.ether.denomination, `loginAccount.ether.denomination isn't a string`);
	// assert.equal(actual.ether.denomination, 'eth', `loginAccount.ether.denomination isn't 'eth'`);

	// loginAccount.realEther
	assert.isDefined(actual.realEther, `loginAccount.realEther isn't defined`);
	assert.isObject(actual.realEther , `loginAccount.realEther isn't an object`);
	assert.isDefined(actual.realEther.value, `loginAccount.realEther.value isn't defined`);
	assert.isNumber(actual.realEther.value, `loginAccount.realEther.value isn't a number`);
	assert.isDefined(actual.realEther.formattedValue, `loginAccount.realEther.formattedValue isn't defined`);
	assert.isNumber(actual.realEther.formattedValue, `loginAccount.realEther.formattedValue isn't a number`);
	assert.isDefined(actual.realEther.formatted, `loginAccount.realEther.formatted isn't defined`);
	assert.isString(actual.realEther.formatted, `loginAccount.realEther.formatted isn't a string`);
	assert.isDefined(actual.realEther.rounded, `loginAccount.realEther.rounded isn't defined`);
	assert.isString(actual.realEther.rounded, `loginAccount.realEther.rounded isn't a string`);
	assert.isDefined(actual.realEther.minimized, `loginAccount.realEther.minimized isn't defined`);
	assert.isString(actual.realEther.minimized, `loginAccount.realEther.minimized isn't a string`);
	assert.isDefined(actual.realEther.full, `loginAccount.realEther.full isn't defined`);
	assert.isString(actual.realEther.full, `loginAccount.realEther.full isn't a string`);
	assert.isDefined(actual.realEther.denomination, `loginAccount.realEther.denomination isn't defined`);
	assert.isString(actual.realEther.denomination, `loginAccount.realEther.denomination isn't a string`);
	// assert.equal(actual.realEther.denomination, 'eth', `loginAccount.realEther.denomination isn't 'eth'`);
}

module.exports = loginAccountAssertion;
