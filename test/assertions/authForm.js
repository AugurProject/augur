var assert = require('chai').assert;
// authForm: Object,
function authFormAssertion(actual) {
	assert.isDefined(actual, `authForm isn't defined`);
	assert.isObject(actual, `authForm isn't an object`);

	assert.isDefined(actual.closeLink, `authFrom.closeLink isn't defined`);
	assert.isObject(actual.closeLink, `authFrom.closeLink isn't an object`);

	assert.isDefined(actual.closeLink.href, `authForm.closeLink.href isn't defined`);
	assert.isString(actual.closeLink.href, `authForm.closeLink.href isn't a string`);

	assert.isDefined(actual.closeLink.onClick, `authForm.closeLink.onClick isn't defined`);
	assert.isFunction(actual.closeLink.onClick, `authForm.closeLink.onClick isn't a function`);

	if (actual.title !== undefined) {
		assert.isDefined(actual.title, `authForm.title isn't defined`);
		assert.isString(actual.title, `authForm.title isn't a string`);
		// for some reason augur doesn't pass classname currently...
		// assert.isDefined(actual.className, `authForm.className isn't defined`);
		// assert.isString(actual.className, `authForm.className isn't a string`);

		assert.isDefined(actual.isVisibleName, `authForm.isVisibleName isn't defined`);
		assert.isBoolean(actual.isVisibleName, `authForm.isVisibleName isn't a boolean`);

		assert.isDefined(actual.isVisiblePassword, `authForm.isVisiblePassword isn't defined`);
		assert.isBoolean(actual.isVisiblePassword, `authForm.isVisiblePassword isn't a boolean`);

		assert.isDefined(actual.isVisiblePassword2, `authForm.isVisiblePassword2 isn't defined`);
		assert.isBoolean(actual.isVisiblePassword2, `authForm.isVisiblePassword2 isn't a boolean`);

		assert.isDefined(actual.msgClass, `authForm.msgClass isn't defined`);
		assert.isString(actual.msgClass, `authForm.msgClass isn't a string`);

		assert.isDefined(actual.topLinkText, `authForm.topLinkText isn't defined`);
		assert.isString(actual.topLinkText, `authForm.topLinkText isn't a string`);

		assert.isDefined(actual.topLink, `authForm.topLink isn't defined`);
		assert.isObject(actual.topLink, `authForm.topLink isn't an object`);

		assert.isDefined(actual.topLink.href, `authForm.topLink.href isn't defined`);
		assert.isString(actual.topLink.href, `authForm.topLink.href isn't a string`);

		assert.isDefined(actual.topLink.onClick, `authForm.topLink.onClick isn't defined`);
		assert.isFunction(actual.topLink.onClick, `authForm.topLink.onClick isn't a function`);

		assert.isDefined(actual.submitButtonText, `authForm.submitButtonText isn't defined`);
		assert.isString(actual.submitButtonText, `authForm.submitButtonText isn't a string`);

		assert.isDefined(actual.submitButtonClass, `authForm.submitButtonClass isn't defined`);
		assert.isString(actual.submitButtonClass, `authForm.submitButtonClass isn't a string`);

		assert.isDefined(actual.onSubmit, `authForm.onSubmit isn't defined`);
		assert.isFunction(actual.onSubmit, `authForm.onSubmit isn't a function`);
	}

	if (actual.msgClass === 'error') {
		assert.isDefined(actual.msg, `error was thrown but authForm.msg isn't defined to display`);
		assert.isString(actual.msg, `error was thrown but authForm.msg isn't a string`);
	}
}
module.exports = authFormAssertion;
