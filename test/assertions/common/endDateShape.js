export default function (endDate){
	assert.isDefined(endDate.value, 'endDate.value is not defined');
	assert.instanceOf(endDate.value, Date, 'endDate.value is not a date');

	assert.isDefined(endDate.formatted, 'endDate.formatted is not defined');
	assert.isString(endDate.formatted, 'endDate.formatted is not a string');

	assert.isDefined(endDate.full, 'endDate.full is not defined');
	assert.isString(endDate.full, 'endDate.full is not a string');
}
