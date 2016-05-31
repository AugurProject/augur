import {assert} from 'chai';

// const selectorsLocation =
// process.env.selectors ? process.env.selectors : '../src/selectors';
// let selectors = require(selectorsLocation);
// process.env.selectors ? selectors = selectors.default : selectors;
import selectors from '../src/selectors';
import loginAccountAssertion from './loginAccount-assertion.js';

describe(`selectors.loginAccount tests:`, () => {
		// loginAccount:
	  //  { id: String,
	  //    handle: String,
	  //    rep:
	  //     { value: Number,
	  //       formattedValue: Number,
	  //       formatted: String,
	  //       rounded: String,
	  //       minimized: String,
	  //       full: String,
	  //       denomination: 'rep' },
	  //    ether:
	  //     { value: Number,
	  //       formattedValue: Number,
	  //       formatted: String,
	  //       rounded: String,
	  //       minimized: String,
	  //       full: String,
	  //       denomination: 'eth' },
	  //    realEther:
	  //     { value: Number,
	  //       formattedValue: Number,
	  //       formatted: String,
	  //       rounded: String,
	  //       minimized: String,
	  //       full: String,
	  //       denomination: 'eth' } },
		it(`should contain a loginAccount with the expected shape`, () => {
			let actual = selectors.loginAccount;
			loginAccountAssertion(actual);
		});
});
