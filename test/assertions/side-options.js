import { assert } from 'chai';

export default function(sideOptions) {
	describe('sideOptions', () => {
		it('should exist', () => {
			assert.isDefined(sideOptions, `sideOptions isn't defined`);
		});

		it('should be an array', () => {
			assert.isArray(sideOptions, `sideOptions isn't an array`);
		});
	});
}
