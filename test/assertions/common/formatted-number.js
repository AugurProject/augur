import { assert } from 'chai';

export default function (formattedNumber, label = 'formatted number') {
	assert.isDefined(formattedNumber, `${label} doesn't exist`);
	assert.isObject(formattedNumber, `${label} isn't an object`);
	assert.isDefined(formattedNumber.value, `${label} 'value' isn't defined`);
	assert.isNumber(formattedNumber.value, `${label} 'value' isn't a number`);
	assert.isDefined(formattedNumber.formattedValue, `${label} formattedValue isn't defined`);
	assert.isNumber(formattedNumber.formattedValue, `${label} formattedValue isn't a number`);
	assert.isDefined(formattedNumber.formatted, `${label} 'formatted' isn't defined`);
	assert.isString(formattedNumber.formatted, `${label} 'formatted' isn't a string`);
	assert.isDefined(formattedNumber.roundedValue, `${label} 'roundedValue' isn't defined`);
	assert.isNumber(formattedNumber.roundedValue, `${label} 'roundedValue' isn't a number`);
	assert.isDefined(formattedNumber.rounded, `${label} 'rounded' isn't defined`);
	assert.isString(formattedNumber.rounded, `${label} 'rounded' isn't a string`);
	assert.isDefined(formattedNumber.minimized, `${label} 'minimized' isn't defined`);
	assert.isString(formattedNumber.minimized, `${label} 'minimized' isn't a string`);
	assert.isDefined(formattedNumber.denomination, `${label} 'denomination' isn't defined`);
	assert.isString(formattedNumber.denomination, `${label} 'denomination' isn't a String`);
	assert.isDefined(formattedNumber.full, `${label} 'full' isn't defined`);
	assert.isString(formattedNumber.full, `${label} 'full' isn't a string`);
}