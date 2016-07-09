import { assert } from 'chai';

export default function (filters) {
	var tags = filters[0];

	assert.isDefined(filters, `filters isn't defined`);
	assert.isArray(filters, `filters isn't an array`);
	assert.equal(filters.length, 1, `filters array isn't the expected length`);
	assert.isObject(tags, `filters[0] isn't an object`);

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
