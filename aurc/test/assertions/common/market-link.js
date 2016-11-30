import { assert } from 'chai';

export default function (marketLink, label = 'marketLink') {
	describe(label, () => {
		it('should be market link', () => {
			assert.isDefined(marketLink, `'marketLink' is not defined`);
			assert.isObject(marketLink, `'marketLink' is not defined`);

			assert.isDefined(marketLink.text,`'text' is not defined`);
			assert.isString(marketLink.text, `'text' is not a string`);

			assert.isDefined(marketLink.className, `'className' is not defined`);
			assert.isString(marketLink.className, `'className' is not a string`);

			assert.isDefined(marketLink.onClick, `'onClick' is not defined`);
			assert.isFunction(marketLink.onClick, `'onClick' is not a function`);
		});
	});
}