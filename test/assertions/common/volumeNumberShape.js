import { assert } from 'chai';

// <volume formatted number>: {
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
	assert.isDefined(actual, `volume formatted number doesn't exist`);
	assert.isObject(actual, `volume formatted number isn't an object`);
	assert.isDefined(actual.value, `volume formatted number value isn't defined`);
	assert.isNumber(actual.value, `volume formatted number value isn't a number`);
	assert.isDefined(actual.formattedValue, `volume formatted number formattedValue isn't defined`);
	assert.isNumber(actual.formattedValue, `volume formatted number formattedValue isn't a number`);
	assert.isDefined(actual.formatted, `volume formatted number formatted isn't defined`);
	assert.isString(actual.formatted, `volume formatted number formatted isn't a string`);
	assert.isDefined(actual.roundedValue, `volume formatted number roundedValue isn't defined`);
	assert.isNumber(actual.roundedValue, `volume formatted number roundedValue isn't a number`);
	assert.isDefined(actual.rounded, `volume formatted number rounded isn't defined`);
	assert.isString(actual.rounded, `volume formatted number rounded isn't a string`);
	assert.isDefined(actual.minimized, `volume formatted number minimized isn't defined`);
	assert.isString(actual.minimized, `volume formatted number minimized isn't a string`);
	assert.isDefined(actual.denomination, `volume formatted number denomination isn't defined`);
	assert.isString(actual.denomination, `volume formatted number denomination isn't a String`);
	assert.isDefined(actual.full, `volume formatted number full isn't defined`);
	assert.isString(actual.full, `volume formatted number full isn't a string`);
}