import { assert } from 'chai';

export default function (transactions) {
	assert.isDefined(transactions, `transactions isn't defined`);
	assert.isArray(transactions, `transactions isn't an array`);
	if (transactions[0] !== undefined) {
		assert.isDefined(transactions[0], `transactions[0] isn't defined`);
		assert.isObject(transactions[0], `transactions[0] isn't an object`);
		transactionAssertion(transactions[0]);
	}
}

function transactionAssertion(transaction) {
	assert.isDefined(transaction.id, `transactions[0].id isn't defined`);
	assert.isString(transaction.id, `transactions[0].id isn't a string`);
	assert.isDefined(transaction.type, `transactions[0].type isn't defined`);
	assert.isString(transaction.type, `transactions[0].type isn't a string`);
	assert.isDefined(transaction.status, `transactions[0].status isn't defined`);
	assert.isString(transaction.status, `transcations[0].status isn't a string`);
	assert.isDefined(transaction.message, `transactions[0].message isn't defined`);
	assert.isString(transaction.message, `transactions[0].message isn't a string`);
}
