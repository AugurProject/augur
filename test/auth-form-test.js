import selectors from '../src/selectors';
import authFormAssertion from './assertions/authForm';

describe(`selectors.authForm tests:`, () => {
	// authForm: Object,
	it(`should contain a authForm with the expected shape`, () => {
		let actual = selectors.authForm;
		authFormAssertion(actual);
	});
});
