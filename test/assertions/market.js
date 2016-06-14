var assert = require('chai').assert;
// markets:
//  [ { id: String,
//      type: String,
//      description: String,
//      endDate: Object,
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
//      report: Object },
// 				...
// 	]
function marketAssertion(actual) {
	assert.isDefined(actual, `markets is empty.`)
	assert.isObject(actual, `markets[0] (market) isn't an object`);

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
	tradingFeePercentAssertion(actual.tradingFeePercent);

	assert.isDefined(actual.volume, `market.volume isn't defined`);
	assert.isObject(actual.volume, `market.volume isn't an object`);
	volumeAssertion(actual.volume);

	assert.isDefined(actual.isOpen, `market.isOpen isn't defined`);
	assert.isBoolean(actual.isOpen, `market.isOpen isn't a boolean`);

	assert.isDefined(actual.isPendingReport, `market.isPendingReport isn't defined`);
	assert.isBoolean(actual.isPendingReport, `market.isPendingReport isn't a boolean`);

	assert.isDefined(actual.marketLink, `market.marketLink isn't defined`);
	assert.isObject(actual.marketLink, `market.marketLink isn't an object`);
	marketLinkAssertion(actual.marketLink);

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
	assert.isObject(actual.report, `market.report isn't an object`);
	reportAssertion(actual.report);

	assert.isDefined(actual.orderBook, `market.orderBook isn't defined`);
	assert.isObject(actual.orderBook, `market.orderBook isn't an object`);
}
// tradingFeePercent: {
// 	value: Number,
//   formattedValue: Number,
//   formatted: String,
//   roundedValue: Number,
//   rounded: String,
//   minimized: String,
//   denomination: String,
//   full: String
// }
function tradingFeePercentAssertion(actual) {
	assert.isDefined(actual, `market.tradingFeePercent doesn't exist`);
	assert.isObject(actual, `market.tradingFeePercent isn't an object`);
	assert.isDefined(actual.value, `tradingFeePercent.value isn't defined`);
	assert.isNumber(actual.value, `tradingFeePercent.value isn't a number`);
	assert.isDefined(actual.formattedValue, `tradingFeePercent.formattedValue isn't defined`);
	assert.isNumber(actual.formattedValue, `tradingFeePercent.formattedValue isn't a number`);
	assert.isDefined(actual.formatted, `tradingFeePercent.formatted isn't defined`);
	assert.isString(actual.formatted, `tradingFeePercent.formatted isn't a string`);
	assert.isDefined(actual.roundedValue, `tradingFeePercent.roundedValue isn't defined`);
	assert.isNumber(actual.roundedValue, `tradingFeePercent.roundedValue isn't a number`);
	assert.isDefined(actual.rounded, `tradingFeePercent.rounded isn't defined`);
	assert.isString(actual.rounded, `tradingFeePercent.rounded isn't a string`);
	assert.isDefined(actual.minimized, `tradingFeePercent.minimized isn't defined`);
	assert.isString(actual.minimized, `tradingFeePercent.minimized isn't a string`);
	assert.isDefined(actual.denomination, `tradingFeePercent.denomination isn't defined`);
	assert.isString(actual.denomination, `tradingFeePercent.denomination isn't a String`);
	assert.isDefined(actual.full, `tradingFeePercent.full isn't defined`);
	assert.isString(actual.full, `tradingFeePercent.full isn't a string`);
}
// volume: {
// 	value: Number,
//   formattedValue: Number,
//   formatted: String,
//   roundedValue: Number,
//   rounded: String,
//   minimized: String,
//   denomination: String,
//   full: String
// }
function volumeAssertion(actual) {
	assert.isDefined(actual, `market.volume doesn't exist`);
	assert.isObject(actual, `market.volume isn't an object`);
	assert.isDefined(actual.value, `volume.value isn't defined`);
	assert.isNumber(actual.value, `volume.value isn't a number`);
	assert.isDefined(actual.formattedValue, `volume.formattedValue isn't defined`);
	assert.isNumber(actual.formattedValue, `volume.formattedValue isn't a number`);
	assert.isDefined(actual.formatted, `volume.formatted isn't defined`);
	assert.isString(actual.formatted, `volume.formatted isn't a string`);
	assert.isDefined(actual.roundedValue, `volume.roundedValue isn't defined`);
	assert.isNumber(actual.roundedValue, `volume.roundedValue isn't a number`);
	assert.isDefined(actual.rounded, `volume.rounded isn't defined`);
	assert.isString(actual.rounded, `volume.rounded isn't a string`);
	assert.isDefined(actual.minimized, `volume.minimized isn't defined`);
	assert.isString(actual.minimized, `volume.minimized isn't a string`);
	assert.isDefined(actual.denomination, `volume.denomination isn't defined`);
	assert.isString(actual.denomination, `volume.denomination isn't a String`);
	assert.isDefined(actual.full, `volume.full isn't defined`);
	assert.isString(actual.full, `volume.full isn't a string`);
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
	tradingFeePercentAssertion: tradingFeePercentAssertion,
	marketAssertion: marketAssertion,
	volumeAssertion: volumeAssertion,
	reportAssertion: reportAssertion,
	marketLinkAssertion: marketLinkAssertion
};
