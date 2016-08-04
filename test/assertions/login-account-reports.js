import { assert } from 'chai';

export default function (loginAccountReports){
	describe(`augur-ui-react-components loginAccountReports' shape`, () => {
		assert.isDefined(loginAccountReports);
		assert.isArray(loginAccountReports);

		it('TODO -- My Reports is not yet built');
	});
};