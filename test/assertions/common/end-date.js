import { assert } from 'chai';

export default function (endDate, label = 'Formatted Date'){
	describe(label, () => {
		describe('value', () => {
			it('should exist', () => {
				assert.isDefined(endDate.value, 'endDate.value is not defined');
			});

			it('should be an instanceOf a Date', () => {
				assert.instanceOf(endDate.value, Date, 'endDate.value is not a date');
			});
		});

		describe('formatted', () => {
			it('should exist', () => {
				assert.isDefined(endDate.formatted, 'endDate.formatted is not defined');
			});

			it('should be a string', () => {
				assert.isString(endDate.formatted, 'endDate.formatted is not a string');
			});
		});

		describe('full', () => {
			it('should exist', () => {
				assert.isDefined(endDate.full, 'endDate.full is not defined');
			});

			it('should be a string', () => {
				assert.isString(endDate.full, 'endDate.full is not a string');
			});
		});
	});
}
