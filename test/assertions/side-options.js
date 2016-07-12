import { assert } from 'chai';

export default function(sideOptions) {
	describe('sideOptions', () => {
		it('should exist', () => {
			assert.isDefined(sideOptions, `sideOptions isn't defined`);
		});

		it('should be an array', () => {
			assert.isArray(sideOptions, `sideOptions isn't an array`);
		});

		sideOptions.forEach(option => {
			describe('option', () => {
				it('should be an object', () => {
					assert.isObject(option, `option isn't an object`);
				});

				describe('value', () => {
					it('should exist', () => {
						assert.isDefined(option.value, `value isn't defined`);
					});

					it('should be a string', () => {
						assert.isString(option.value, `value isn't a string`);
					});
				});

				describe('label', () => {
					it('should exist', () => {
						assert.isDefined(option.label, `label isn't defined`);
					});

					it('should be a string', () => {
						assert.isString(option.label, `label isn't a string`);
					});
				});
			});
		});
	});
}
