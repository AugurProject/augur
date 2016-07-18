import { assert } from 'chai';

export default function (portfolio){
	assert.isDefined(portfolio, `portfolio isn't defined`);
	assert.isObject(portfolio, `portfolio isn't an object`);
};