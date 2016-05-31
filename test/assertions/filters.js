var assert = require('chai').assert;
// filters:
// [ { title: 'Status', options: [ Object, ... ] },
// 	{ title: 'Type', options: [ Object, ... ] },
// 	{ title: 'Tags', options: [ Object, ... ] } ],
function filtersAssertion(actual) {
	var status = actual[0];
	var type = actual[1];
	var tags = actual[2];

	assert.isDefined(actual, `filters isn't defined`);
	assert.isArray(actual, `filters isn't an array`);
	assert.equal(actual.length, 3, `filters array isn't the expected length`);
	assert.isObject(status, `filters[0] isn't an object`);
	assert.isObject(type, `filters[1] isn't an object`);
	assert.isObject(tags, `filters[2] isn't an object`);

	// Status object tests
	assert.isDefined(status, `filters[0] isn't defined`);
	assert.isObject(status, `filters[0] isn't an object`);
	assert.isDefined(status.title, `filters[0].title isn't defined`);
	assert.isString(status.title, `filters[0].title isn't a string`);
	assert.equal(status.title, 'Status', `filters[0].title should equal 'Status'`);
	assert.isDefined(status.options, `filters[0].options isn't defined`);
	assert.isArray(status.options, `filters[0].options isn't an array`);
	assert.isDefined(status.options[0], `filters[0].options[0] isn't defined`);
	assert.isObject(status.options[0], `filters[0].options[0] isn't an object`);

	// Status Options Tests
	assert.isDefined(status.options[0], `[0].options[0] isn't defined`);
	assert.isObject(status.options[0], `[0].options[0] isn't a object`);
	assert.isDefined(status.options[0].name, `[0].options[0].name isn't defined`);
	assert.isString(status.options[0].name, `[0].options[0].name isn't a string`);
	assert.isDefined(status.options[0].value, `[0].options[0].value isn't defined`);
	assert.isString(status.options[0].value, `[0].options[0].value isn't a string`);
	assert.isDefined(status.options[0].numMatched, `[0].options[0].numMatched isn't defined`);
	assert.isNumber(status.options[0].numMatched, `[0].options[0].numMatched isn't a number`);
	assert.isDefined(status.options[0].isSelected, `[0].options[0].isSelected isn't defined`);
	assert.isBoolean(status.options[0].isSelected, `[0].options[0].isSelected isn't a boolean`);
	assert.isDefined(status.options[0].onClick, `[0].options[0].onClick isn't defined`);
	assert.isFunction(status.options[0].onClick, `[0].options[0].onClick isn't a function`);

	// Type object tests
	assert.isDefined(type, `filters[0] isn't defined`);
	assert.isObject(type, `filters[0] isn't an object`);
	assert.isDefined(type.title, `filters[0].title isn't defined`);
	assert.isString(type.title, `filters[0].title isn't a string`);
	assert.equal(type.title, 'Type', `filters[0].title should equal 'Status'`);
	assert.isDefined(type.options, `filters[0].options isn't defined`);
	assert.isArray(type.options, `filters[0].options isn't an array`);
	assert.isDefined(type.options[0], `filters[0].options[0] isn't defined`);
	assert.isObject(type.options[0], `filters[0].options[0] isn't an object`);

	// Type Options Tests
	assert.isDefined(type.options[0], `[0].options[0] isn't defined`);
	assert.isObject(type.options[0], `[0].options[0] isn't a object`);
	assert.isDefined(type.options[0].name, `[0].options[0].name isn't defined`);
	assert.isString(type.options[0].name, `[0].options[0].name isn't a string`);
	assert.isDefined(type.options[0].value, `[0].options[0].value isn't defined`);
	assert.isString(type.options[0].value, `[0].options[0].value isn't a string`);
	assert.isDefined(type.options[0].numMatched, `[0].options[0].numMatched isn't defined`);
	assert.isNumber(type.options[0].numMatched, `[0].options[0].numMatched isn't a number`);
	assert.isDefined(type.options[0].isSelected, `[0].options[0].isSelected isn't defined`);
	assert.isBoolean(type.options[0].isSelected, `[0].options[0].isSelected isn't a boolean`);
	assert.isDefined(type.options[0].onClick, `[0].options[0].onClick isn't defined`);
	assert.isFunction(type.options[0].onClick, `[0].options[0].onClick isn't a function`);

	// Tags object tests
	assert.isDefined(tags, `filters[0] isn't defined`);
	assert.isObject(tags, `filters[0] isn't an object`);
	assert.isDefined(tags.title, `filters[0].title isn't defined`);
	assert.isString(tags.title, `filters[0].title isn't a string`);
	assert.equal(tags.title, 'Tags', `filters[0].title should equal 'Status'`);
	assert.isDefined(tags.options, `filters[0].options isn't defined`);
	assert.isArray(tags.options, `filters[0].options isn't an array`);
	assert.isDefined(tags.options[0], `filters[0].options[0] isn't defined`);
	assert.isObject(tags.options[0], `filters[0].options[0] isn't an object`);

	// Tags Options Tests
	assert.isDefined(tags.options[0], `[0].options[0] isn't defined`);
	assert.isObject(tags.options[0], `[0].options[0] isn't a object`);
	assert.isDefined(tags.options[0].name, `[0].options[0].name isn't defined`);
	assert.isString(tags.options[0].name, `[0].options[0].name isn't a string`);
	assert.isDefined(tags.options[0].value, `[0].options[0].value isn't defined`);
	assert.isString(tags.options[0].value, `[0].options[0].value isn't a string`);
	assert.isDefined(tags.options[0].numMatched, `[0].options[0].numMatched isn't defined`);
	assert.isNumber(tags.options[0].numMatched, `[0].options[0].numMatched isn't a number`);
	assert.isDefined(tags.options[0].isSelected, `[0].options[0].isSelected isn't defined`);
	assert.isBoolean(tags.options[0].isSelected, `[0].options[0].isSelected isn't a boolean`);
	assert.isDefined(tags.options[0].onClick, `[0].options[0].onClick isn't defined`);
	assert.isFunction(tags.options[0].onClick, `[0].options[0].onClick isn't a function`);
}
module.exports = filtersAssertion;
