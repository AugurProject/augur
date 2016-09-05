import { assert } from 'chai';

export default function (loginAccountPositions){
	describe(`augur-ui-react-components loginAccountPositions' shape`, () => {
		assert.isDefined(loginAccountPositions);
		assert.isObject(loginAccountPositions);

		it('markets', () => {
			assert.isDefined(loginAccountPositions.markets);
			assert.isArray(loginAccountPositions.markets);
		});

		it('summary', () => {
			assert.isDefined(loginAccountPositions.summary);
			assert.isObject(loginAccountPositions.summary);
		});

		it('sharesPurchased', () => {
			assert.isDefined(loginAccountPositions.sharesPurchased);
			assert.isArray(loginAccountPositions.sharesPurchased);
		});
	});
};