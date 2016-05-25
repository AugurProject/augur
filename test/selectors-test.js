import {assert} from 'chai';
import selectors from '../src/selectors';

describe(`Selector shape tests. Selector...`, () => {
	it(`should contain loginAccount with the expected shape`, () => {
		let actual = selectors.loginAccount;

		// loginAccount overall
		assert.isDefined(actual, `loginAccount isn't defined`);
		assert.isObject(actual, `loginAccount isn't an object`);

		// loginAccount.id
		assert.isDefined(actual.id, `loginAccount.id isn't defined`);
		assert.isString(actual.id, `loginAccount.id isn't a string`);

		// loginAccount.handle
		assert.isDefined(actual.handle, `loginAccount.handle isn't defined`);
		assert.isString(actual.handle, `loginAccount.handle isn't a string`);

		// loginAccount.rep
		assert.isDefined(actual.rep, `loginAccount.rep isn't defined`);
		assert.isObject(actual.rep , `loginAccount.rep isn't an object`);
		assert.isDefined(actual.rep.value, `loginAccount.rep.value isn't defined`);
		assert.isNumber(actual.rep.value, `loginAccount.rep.value isn't a number`);
		assert.isDefined(actual.rep.formattedValue, `loginAccount.rep.formattedValue isn't defined`);
		assert.isNumber(actual.rep.formattedValue, `loginAccount.rep.formattedValue isn't a number`);
		assert.isDefined(actual.rep.formatted, `loginAccount.rep.formatted isn't defined`);
		assert.isString(actual.rep.formatted, `loginAccount.rep.formatted isn't a string`);
		assert.isDefined(actual.rep.rounded, `loginAccount.rep.rounded isn't defined`);
		assert.isString(actual.rep.rounded, `loginAccount.rep.rounded isn't a string`);
		assert.isDefined(actual.rep.minimized, `loginAccount.rep.minimized isn't defined`);
		assert.isString(actual.rep.minimized, `loginAccount.rep.minimized isn't a string`);
		assert.isDefined(actual.rep.full, `loginAccount.rep.full isn't defined`);
		assert.isString(actual.rep.full, `loginAccount.rep.full isn't a string`);
		assert.isDefined(actual.rep.denomination, `loginAccount.rep.denomination isn't defined`);
		assert.isString(actual.rep.denomination, `loginAccount.rep.denomination isn't a string`);
		assert.equal(actual.rep.denomination, 'rep', `loginAccount.rep.denomination isn't 'rep'`);

		// loginAccount.ether
		assert.isDefined(actual.ether, `loginAccount.ether isn't defined`);
		assert.isObject(actual.ether , `loginAccount.ether isn't an object`);
		assert.isDefined(actual.ether.value, `loginAccount.ether.value isn't defined`);
		assert.isNumber(actual.ether.value, `loginAccount.ether.value isn't a number`);
		assert.isDefined(actual.ether.formattedValue, `loginAccount.ether.formattedValue isn't defined`);
		assert.isNumber(actual.ether.formattedValue, `loginAccount.ether.formattedValue isn't a number`);
		assert.isDefined(actual.ether.formatted, `loginAccount.ether.formatted isn't defined`);
		assert.isString(actual.ether.formatted, `loginAccount.ether.formatted isn't a string`);
		assert.isDefined(actual.ether.rounded, `loginAccount.ether.rounded isn't defined`);
		assert.isString(actual.ether.rounded, `loginAccount.ether.rounded isn't a string`);
		assert.isDefined(actual.ether.minimized, `loginAccount.ether.minimized isn't defined`);
		assert.isString(actual.ether.minimized, `loginAccount.ether.minimized isn't a string`);
		assert.isDefined(actual.ether.full, `loginAccount.ether.full isn't defined`);
		assert.isString(actual.ether.full, `loginAccount.ether.full isn't a string`);
		assert.isDefined(actual.ether.denomination, `loginAccount.ether.denomination isn't defined`);
		assert.isString(actual.ether.denomination, `loginAccount.ether.denomination isn't a string`);
		assert.equal(actual.ether.denomination, 'eth', `loginAccount.ether.denomination isn't 'eth'`);

		// loginAccount.realEther
		assert.isDefined(actual.realEther, `loginAccount.realEther isn't defined`);
		assert.isObject(actual.realEther , `loginAccount.realEther isn't an object`);
		assert.isDefined(actual.realEther.value, `loginAccount.realEther.value isn't defined`);
		assert.isNumber(actual.realEther.value, `loginAccount.realEther.value isn't a number`);
		assert.isDefined(actual.realEther.formattedValue, `loginAccount.realEther.formattedValue isn't defined`);
		assert.isNumber(actual.realEther.formattedValue, `loginAccount.realEther.formattedValue isn't a number`);
		assert.isDefined(actual.realEther.formatted, `loginAccount.realEther.formatted isn't defined`);
		assert.isString(actual.realEther.formatted, `loginAccount.realEther.formatted isn't a string`);
		assert.isDefined(actual.realEther.rounded, `loginAccount.realEther.rounded isn't defined`);
		assert.isString(actual.realEther.rounded, `loginAccount.realEther.rounded isn't a string`);
		assert.isDefined(actual.realEther.minimized, `loginAccount.realEther.minimized isn't defined`);
		assert.isString(actual.realEther.minimized, `loginAccount.realEther.minimized isn't a string`);
		assert.isDefined(actual.realEther.full, `loginAccount.realEther.full isn't defined`);
		assert.isString(actual.realEther.full, `loginAccount.realEther.full isn't a string`);
		assert.isDefined(actual.realEther.denomination, `loginAccount.realEther.denomination isn't defined`);
		assert.isString(actual.realEther.denomination, `loginAccount.realEther.denomination isn't a string`);
		assert.equal(actual.realEther.denomination, 'eth', `loginAccount.realEther.denomination isn't 'eth'`);
	});

	it(`should contain a markets array with market objects`, () => {
		let actual = selectors.markets;

		assert.isDefined(actual, `markets is not defined`);
		assert.isArray(actual, `markets isn't an array`);
		assert.isDefined(actual[0], `markets is empty`);
		assert.isObject(actual[0], `markets doesn't contain market objects`);
	});

	it(`should have a market that is formatted correctly`, () => {
		let actual = selectors.markets[0];

		assert.isDefined(actual.id, `market.id isn't defined.`);
		assert.isString(actual.id, `market.id isn't a string`);

		assert.isDefined(actual.type, `market.type isn't defined.`);
		assert.isString(actual.type, `market.type isn't a string`);

		assert.isDefined(actual.description, `market.description isn't defined`);
		assert.isString(actual.description, `market.description isn't a string`);

		assert.isDefined(actual.endDate, `market.endDate isn't defined`);
		assert.isObject(actual.endDate, `market.endDate isn't an object`);

		assert.isDefined(actual.tradingFeePercent, `market.tradingFeePercent isn't defined`);
		assert.isObject(actual.tradingFeePercent, `market.tradingFeePercent isn't an object`);

		assert.isDefined(actual.volume, `market.volume isn't defined`);
		assert.isObject(actual.volume, `market.volume isn't an object`);

		assert.isDefined(actual.isOpen, `market.isOpen isn't defined`);
		assert.isBoolean(actual.isOpen, `market.isOpen isn't a boolean`);

		assert.isDefined(actual.isPendingReport, `market.isPendingReport isn't defined`);
		assert.isBoolean(actual.isPendingReport, `market.isPendingReport isn't a boolean`);

		assert.isDefined(actual.marketLink, `market.marketLink isn't defined`);
		assert.isObject(actual.marketLink, `market.marketLink isn't an object`);

		assert.isDefined(actual.tags, `market.tags isn't defined`);
		assert.isArray(actual.tags, `market.tags isn't an array`);

		assert.isDefined(actual.outcomes, `market.outcomes isn't defined`);
		assert.isArray(actual.outcomes, `market.outcomes isn't an array`);

		assert.isDefined(actual.reportableOutcomes, `market.reportableOutcomes isn't defined`);
		assert.isArray(actual.reportableOutcomes, `market.reportableOutcomes isn't an array`);

		assert.isDefined(actual.tradeSummary, `market.tradeSummary isn't defined`);
		assert.isObject(actual.tradeSummary, `market.tradeSummary isn't a object`);

		assert.isDefined(actual.priceTimeSeries, `market.priceTimeSeries isn't defined`);
		assert.isArray(actual.priceTimeSeries, `market.priceTimeSeries isn't an array`);

		assert.isDefined(actual.positionsSummary, `market.positionsSummary isn't defined`);
		assert.isObject(actual.positionsSummary, `market.positionsSummary isn't an object`);

		assert.isDefined(actual.report, `market.report isn't defined`);
		assert.isObject(actual.report, `market.positionsSummary isn't an object`);
	});
});
