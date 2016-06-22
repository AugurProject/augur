import { assert } from 'chai';

// <percent formatted number>: {
// 	 value: Number,
//   formattedValue: Number,
//   formatted: String,
//   roundedValue: Number,
//   rounded: String,
//   minimized: String,
//   denomination: String,
//   full: String
// }
export default function (actual) {
	assert.isDefined(actual, `percent formatted number doesn't exist`);
	assert.isObject(actual, `percent formatted number isn't an object`);
	assert.isDefined(actual.value, `percent formatted number value isn't defined`);
	assert.isNumber(actual.value, `percent formatted number value isn't a number`);
	assert.isDefined(actual.formattedValue, `percent formatted number formattedValue isn't defined`);
	assert.isNumber(actual.formattedValue, `percent formatted number formattedValue isn't a number`);
	assert.isDefined(actual.formatted, `percent formatted number formatted isn't defined`);
	assert.isString(actual.formatted, `percent formatted number formatted isn't a string`);
	assert.isDefined(actual.roundedValue, `percent formatted number roundedValue isn't defined`);
	assert.isNumber(actual.roundedValue, `percent formatted number roundedValue isn't a number`);
	assert.isDefined(actual.rounded, `percent formatted number rounded isn't defined`);
	assert.isString(actual.rounded, `percent formatted number rounded isn't a string`);
	assert.isDefined(actual.minimized, `percent formatted number minimized isn't defined`);
	assert.isString(actual.minimized, `percent formatted number minimized isn't a string`);
	assert.isDefined(actual.denomination, `percent formatted number denomination isn't defined`);
	assert.isString(actual.denomination, `percent formatted number denomination isn't a String`);
	assert.isDefined(actual.full, `percent formatted number full isn't defined`);
	assert.isString(actual.full, `percent formatted number full isn't a string`);
}