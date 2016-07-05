var assert = require('chai').assert;

import percentNumberShape from '../../test/assertions/common/percentNumberShape';
import numberShape from '../../test/assertions/common/numberShape';

// markets:
//  {
//      id: String,
//      type: String,
//      description: String,
//      endDate: Object,
//			endDateLabel: String,
//      tradingFeePercent: Object,
//      volume: Object,
//      isOpen: Boolean,
//      isPendingReport: Boolean,
//      marketLink: Object,
//      tags: Object,
//      outcomes: Object,
//      reportableOutcomes: Object,
//      tradeSummary: Function,
//      priceTimeSeries: Object,
//      positionsSummary: Object,
//      report: Object
//  },
function marketAssertion(actual) {
	describe('augur-ui-react-components market state', () => {

		it('should receive a market and be an object', () => {
			assert.isDefined(actual, `markets is empty.`)
			assert.isObject(actual, `markets[0] (market) isn't an object`);
		});

		it('should receive an id and be a string', () => {
			assert.isDefined(actual.id, `market.id isn't defined.`);
			assert.isString(actual.id, `market.id isn't a string`);
		});

		it('should receive a type and be a string', () => {
			assert.isDefined(actual.type, `market.type isn't defined.`);
			assert.isString(actual.type, `market.type isn't a string`);
		});

		it('should receive a description and be a string', () => {
			assert.isDefined(actual.description, `market.description isn't defined`);
			assert.isString(actual.description, `market.description isn't a string`);
		});

		it('should receive an endData and be an object', () => {
			assert.isDefined(actual.endDate, `market.endDate isn't defined`);
			assert.isObject(actual.endDate, `market.endDate isn't an object`);
		});

		it('should receive an endDataLabel and be a string', () => {
			assert.isDefined(actual.endDateLabel, `market.endDateLabel isn't defined`);
			assert.isString(actual.endDateLabel, `market.endDateLabel isn't an string`);
		});

		it('should receive a takerFeePercent and be an object', () => {
			assert.isDefined(actual.takerFeePercent, `market.takerFeePercent isn't defined`);
			assert.isObject(actual.takerFeePercent, `market.takerFeePercent isn't an object`);
			percentNumberShape(actual.takerFeePercent);
		});

		it('should receive a makerFeePercent and be an object', () => {
			assert.isDefined(actual.makerFeePercent, `market.makerFeePercent isn't defined`);
			assert.isObject(actual.makerFeePercent, `market.makerFeePercent isn't an object`);
			percentNumberShape(actual.makerFeePercent);
		});

		it('should receive a volume and be an object', () => {
			assert.isDefined(actual.volume, `market.volume isn't defined`);
			assert.isObject(actual.volume, `market.volume isn't an object`);
			numberShape(actual.volume);
		});

		it('should receive an isOpen and be a boolean', () => {
			assert.isDefined(actual.isOpen, `market.isOpen isn't defined`);
			assert.isBoolean(actual.isOpen, `market.isOpen isn't a boolean`);
		});

		it('should receive an isPendingReport and be a boolean', () => {
			assert.isDefined(actual.isPendingReport, `market.isPendingReport isn't defined`);
			assert.isBoolean(actual.isPendingReport, `market.isPendingReport isn't a boolean`);
		});

		it('should receive a marketLink and be an object', () => {
			assert.isDefined(actual.marketLink, `market.marketLink isn't defined`);
			assert.isObject(actual.marketLink, `market.marketLink isn't an object`);
			marketLinkAssertion(actual.marketLink);
		});

		it('should receive a tags and be an array', () => {
			assert.isDefined(actual.tags, `market.tags isn't defined`);
			assert.isArray(actual.tags, `market.tags isn't an array`);
		});

		it('should receive an outcomes and be an array', () => {
			assert.isDefined(actual.outcomes, `market.outcomes isn't defined`);
			assert.isArray(actual.outcomes, `market.outcomes isn't an array`);
		});

		it('should receive a reportableOutcomes and be an array', () => {
			assert.isDefined(actual.reportableOutcomes, `market.reportableOutcomes isn't defined`);
			assert.isArray(actual.reportableOutcomes, `market.reportableOutcomes isn't an array`);
		});

		it('should receive a tradeSummary and be an object', () => {
			assert.isDefined(actual.tradeSummary, `market.tradeSummary isn't defined`);
			assert.isObject(actual.tradeSummary, `market.tradeSummary isn't a object`);
		});

		it('should receive a priceTimeSeries and be an array', () => {
			assert.isDefined(actual.priceTimeSeries, `market.priceTimeSeries isn't defined`);
			assert.isArray(actual.priceTimeSeries, `market.priceTimeSeries isn't an array`);
		});

		it('should receive a priceTimeSeries and be an array', () => {
			assert.isDefined(actual.positionsSummary, `market.positionsSummary isn't defined`);
			assert.isObject(actual.positionsSummary, `market.positionsSummary isn't an object`);
		});

		it('should receive a report and be an object', () => {
			assert.isDefined(actual.report, `market.report isn't defined`);
			assert.isObject(actual.report, `market.report isn't an object`);
			reportAssertion(actual.report);
		});

		it('should receive an orderBook and be an object', () => {
			assert.isDefined(actual.orderBook, `market.orderBook isn't defined`);
			assert.isObject(actual.orderBook, `market.orderBook isn't an object`);
		});

		it('should receive constants and be an object', () => {
			assert.isDefined(actual.constants, 'market.constants is not defined');
			assert.isObject(actual.constants, 'market.constatn is not an object');
		});
	});
}

// report: {
// 	isUnethical: Boolean,
// 	onSubmitReport: [Function: onSubmitReport]
// }
function reportAssertion(actual) {
	assert.isDefined(actual, `market doesn't have a report object`);
	assert.isObject(actual, `market.report isn't an object`);
	assert.isDefined(actual.isUnethical, `market.report.isUnethical isn't defined`);
	assert.isBoolean(actual.isUnethical, `market.report.isUnethical isn't a boolean`);
	assert.isDefined(actual.onSubmitReport, `market.report.onSubmitReport isn't defined`);
	assert.isFunction(actual.onSubmitReport, `market.report.onSubmitReport isn't a function`);
}
// marketLink: {
// 	text: string,
//   className: string,
//   onClick: [Function: onClick]
// }
function marketLinkAssertion(actual) {
	assert.isDefined(actual, `market.marketLink isn't defined`);
	assert.isObject(actual, `market.marketLink isn't an object`);
	assert.isDefined(actual.text, `market.marketLink.text isn't defined`);
	assert.isString(actual.text, `market.marketLink.text isn't a string`);
	assert.isDefined(actual.className, `market.marketLink.className isn't defined`);
	assert.isString(actual.className, `market.marketLink.className isn't a string`);
	assert.isDefined(actual.onClick, `market.marketLink.onClick isn't defined`);
	assert.isFunction(actual.onClick, `market.marketLink.onClick isn't a function`);
}

module.exports = {
	marketAssertion,
	reportAssertion: reportAssertion,
	marketLinkAssertion: marketLinkAssertion
};
