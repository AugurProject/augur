import { assert } from 'chai';

export default function (link, label) {
	describe(`${label}'s link shape`, () => {
		assert.isDefined(link);
		assert.isObject(link);

		it('href', () => {
			assert.isDefined(link.href);
			assert.isString(link.href);
		});

		it('onClick', () => {
			assert.isDefined(link.onClick);
			assert.isFunction(link.onClick);
		});
	});
}