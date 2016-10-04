import { assert } from 'chai';

export default function (mFS) {
	assert.isDefined(mFS, `'marketsFilterSort' is not defined`);
	assert.isObject(mFS, `'marketsFilterSort' is not an object`);

	const sFS = mFS.selectedFilterSort;

	assert.isDefined(sFS, `'marketsFilterSort.selectedFilterSort is not defined`);
	assert.isObject(sFS, `'marketsFilterSort.selectFilterSort is not an object`);

	assert.isDefined(sFS.type, `'marketsFilterSort.selectedFilterSort.type' is not defined`);
	assert.isString(sFS.type, `'marketsFilterSort.selectedFilterSort.type' is not a string`);

	assert.isDefined(sFS.sort, `'marketsFilterSort.selectedFilterSort.sort' is not defined`);
	assert.isString(sFS.sort, `'marketsFilterSort.selectedFilterSort.sort' is not a string`);

	assert.isDefined(sFS.isDesc, `'marketsFilterSort.selectedFilterSort.isDesc' is not defined`);
	assert.isBoolean(sFS.isDesc, `'marketsFilterSort.selectedFilterSort.isDesc' is not a boolean`);

	assert.isDefined(mFS.types, `'marketsFilterSort.types' is not defined`);
	assert.isArray(mFS.types, `'marketsFilterSort.types' is not an array`);

	mFS.types.forEach((type, i) => {
		assert.isDefined(type.label, `'marketsFilterSort.types[${i}].label' is not defined`);
		assert.isString(type.label, `'marketsFilterSort.types[${i}].label' is not a string`);

		assert.isDefined(type.value, `'marketsFilterSort.types[${i}].value' is not defined`);
		assert.isString(type.value, `'marketsFilterSort.types[${i}].value' is not a string`);
	});

	mFS.sorts.forEach((type, i) => {
		assert.isDefined(type.label, `'marketsFilterSort.sorts[${i}].label' is not defined`);
		assert.isString(type.label, `'marketsFilterSort.sorts[${i}].label' is not a string`);

		assert.isDefined(type.value, `'marketsFilterSort.sorts[${i}].value' is not defined`);
		assert.isString(type.value, `'marketsFilterSort.sorts[${i}].value' is not a string`);
	});

	assert.isDefined(mFS.order, `'marketsFilterSort.order' is not defined`);
	assert.isObject(mFS.order, `'marketsFilterSort.order' is not an object`);

	assert.isDefined(mFS.order.isDesc, `'marketsFilterSort.order.isDesc' is not defined`);
	assert.isBoolean(mFS.order.isDesc, `'marketsFilterSort.order.isDesc' is not a boolean`);
}
