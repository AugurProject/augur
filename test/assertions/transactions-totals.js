import { assert } from 'chai';

export default function(transactionsTotals) {
	assert.isDefined(transactionsTotals, `transactionsTotals isn't defined`);
	assert.isObject(transactionsTotals, `transactionsTotals isn't an object as expected`);
	assert.isDefined(transactionsTotals.title, `transactionsTotals.title isn't defined`);
	assert.isString(transactionsTotals.title, `transactionsTotals.title isn't a string`);
}
