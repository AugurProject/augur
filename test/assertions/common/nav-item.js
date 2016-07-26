import { assert } from 'chai';
import assertLink from '../../../test/assertions/common/link';

export default function (navItem, ref){
	describe(`${ref}'s navItem shape`, () => {
		assert.isDefined(navItem);
		assert.isObject(navItem);

		it('label', () => {
			assert.isDefined(navItem.label);
			assert.isString(navItem.label);
		});

		it('link', () => {
			assertLink(navItem.link);
		});

		it('page', () => {
			assert.isDefined(navItem.page);
			assert.isString(navItem.page);
		});
	});
}