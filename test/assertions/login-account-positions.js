import { assert } from 'chai';

export default function (loginAccountPositions){
	describe(`augur-ui-react-components loginAccountPositions' shape`, () => {
		assert.isDefined(loginAccountPositions);
		assert.isObject(loginAccountPositions);
	});
};