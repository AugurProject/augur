import { assert } from 'chai';

export default function(sideOptions) {
	describe('augur-ui-react-components trade sideOptions state', () => {
		it('should exist', () => {
			assert.isDefined(sideOptions, 'outcomes is not defined');
		});

		it('should be an array', () => {
			assert.isArray(sideOptions, 'outcomes is not an array');
		});
	});
}
