import { assert } from 'chai';

// <formatted number>: {
// 	 value: Number,
//   formattedValue: Number,
//   formatted: String,
//   roundedValue: Number,
//   rounded: String,
//   minimized: String,
//   denomination: String,
//   full: String
// }
export default function (actual, refObj) {
	descirbe(`${refObj}'s numberShape`, () => {
		describe('value', () => {
			it('should exist', () => {
				assert.isDefined(actual.value, `value isn't defined`);
			});

			it('should be a number', () => {
				assert.isNumber(actual.value, `value isn't a number`);
			});
		});

		describe('formattedValue', () => {
			it('should exist', () => {
				assert.isDefined(actual.formattedValue, `formattedValue isn't defined`);
			});

			it('should be a number', () => {
				assert.isNumber(actual.formattedValue, `formattedValue isn't a number`);
			});
		});

		describe('formatted', () => {
			it('should exist', () => {
				assert.isDefined(actual.formatted, `formatted isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(actual.formatted, `formatted isn't a string`);
			});
		});

		describe('roundedValue', () => {
			it('should exist', () => {
				assert.isDefined(actual.roundedValue, `roundedValue isn't defined`);
			});

			it('should be a number', () => {
				assert.isNumber(actual.roundedValue, `roundedValue isn't a number`);
			});
		});

		describe('rounded', () => {
			it('should exist', () => {
				assert.isDefined(actual.rounded, `rounded isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(actual.rounded, `rounded isn't a string`);
			});
		});

		describe('minimized', () => {
			it('should exist', () => {
				assert.isDefined(actual.minimized, `minimized isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(actual.minimized, `minimized isn't a string`);
			});
		});

		describe('denomination', () => {
			it('should exist', () => {
				assert.isDefined(actual.denomination, `denomination isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(actual.denomination, `denomination isn't a String`);
			});
		});

		describe('full', () => {
			it('should exist', () => {
				assert.isDefined(actual.full, `full isn't defined`);
			});

			it('should be a string', () => {
				assert.isString(actual.full, `full isn't a string`);
			});
		});
	});
};