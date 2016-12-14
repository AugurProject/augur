import { describe, it } from 'mocha';
import { assert } from 'chai';

import assertFormattedDate from '../../test/assertions/common/formatted-date';
import assertInitialFairPrices from '../../test/assertions/common/initial-fair-prices';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';

export default function (createMarketForm) {
	describe('createMarketForm', () => {
		describe(`step ${createMarketForm.step} state`, () => {
			switch (createMarketForm.step) {
				case 1:
					describe('step', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.step, `'step' is not defined`);
						});

						it('should be a number', () => {
							assert.isNumber(createMarketForm.step, `'step' is not a number`);
						});
					});

					describe('creatingMarket', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.creatingMarket, `'creatingMarket' is not defined`);
						});

						it('should be a boolean', () => {
							assert.isBoolean(createMarketForm.creatingMarket, `'creatingMarket' is not a boolean`);
						});
					});

					describe('errors', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.errors, `'errors' is not defined`);
						});

						it('should be a object', () => {
							assert.isObject(createMarketForm.errors, `'errors' is not an object`);
						});
					});

					describe('onValuesUpdated', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.onValuesUpdated, `'onValuesUpdated' is not defined`);
						});

						it('should be a function', () => {
							assert.isFunction(createMarketForm.onValuesUpdated, `onValuesUpdated' is not a function`);
						});
					});

					break;
				case 2:
					describe('type', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.type, `'type' is not defined`);
						});

						it('should be a string', () => {
							assert.isString(createMarketForm.type, `'type' is not a string`);
						});
					});

					describe('initialFairPrices', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.initialFairPrices, `'initialFairPrices' is not defined`);
						});

						it('should be an object', () => {
							assert.isObject(createMarketForm.initialFairPrices, `'initialFairPrices' is not an object`);
						});

						it('should have the correct shape', () => {
							assertInitialFairPrices(createMarketForm.initialFairPrices, 'createMarketForm');
						});
					});

					describe('descriptionPlaceholder', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.descriptionPlaceholder, `'descriptionPlaceholder' is not defined`);
						});

						it('should be a string', () => {
							assert.isString(createMarketForm.descriptionPlaceholder, `'descriptionPlaceholder' is not a string`);
						});
					});

					describe('descriptionMaxLength', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.descriptionMaxLength, `'descriptionMaxLength' is not defined`);
						});

						it('should be a number', () => {
							assert.isNumber(createMarketForm.descriptionMaxLength, `'descriptionMaxLength' is not a number`);
						});
					});

					describe(`type: ${createMarketForm.type}`, () => {
						switch (createMarketForm.type) {
							case 'categorical':
								describe('categoricalOutcomesMinNum', () => {
									it('should be defined', () => {
										assert.isDefined(createMarketForm.categoricalOutcomesMinNum, `'categoricalOutcomesMinNum' is not defined`);
									});

									it('should be a number', () => {
										assert.isNumber(createMarketForm.categoricalOutcomesMinNum, `'categoricalOutcomesMinNum' is not a number`);
									});
								});

								describe('categoricalOutcomesMaxNum', () => {
									it('should be defined', () => {
										assert.isDefined(createMarketForm.categoricalOutcomesMaxNum, `'categoricalOutcomesMaxNum' is not defined`);
									});

									it('should be a number', () => {
										assert.isNumber(createMarketForm.categoricalOutcomesMaxNum, `'categoricalOutcomesMaxNum' is not a number`);
									});
								});

								describe('categoricalOutcomeMaxLength', () => {
									it('should be defined', () => {
										assert.isDefined(createMarketForm.categoricalOutcomeMaxLength, `'categoricalOutcomeMaxLength' is not defined`);
									});

									it('should be a number', () => {
										assert.isNumber(createMarketForm.categoricalOutcomeMaxLength, `'categoricalOutcomeMaxLength' is not a number`);
									});
								});
								break;
							case 'scalar':
								describe('scalarSmallNum', () => {
									it('should be defined', () => {
										assert.isDefined(createMarketForm.scalarSmallNum, `'scalarSmallNum' is not defined`);
									});

									it('should be a number', () => {
										assert.isNumber(createMarketForm.scalarSmallNum, `'scalarSmallNum' is not a number`);
									});
								});

								describe('scalarBigNum', () => {
									it('should be defined', () => {
										assert.isDefined(createMarketForm.scalarBigNum, `'scalarBigNum' is not defined`);
									});

									it('should be a number', () => {
										assert.isNumber(createMarketForm.scalarBigNum, `'scalarBigNum' is not a number`);
									});
								});
								break;
							default:
								break;
						}
					});

					break;
				case 3:
					describe('description', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.description, `'description' is not defined`);
						});

						it('should be a string', () => {
							assert.isString(createMarketForm.description, `'description' is not a string`);
						});
					});

					describe('tagsMaxNum', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.tagsMaxNum, `'tagsMaxNum' is not defined`);
						});

						it('should be a number', () => {
							assert.isNumber(createMarketForm.tagsMaxNum, `'tagsMaxNum' is not a number`);
						});
					});

					describe('tagMaxLength', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.tagMaxLength, `'tagsMaxLength' is not defined`);
						});

						it('should be a number', () => {
							assert.isNumber(createMarketForm.tagMaxLength, `'tagsMaxLength' is not a number`);
						});
					});

					describe('expirySourceTypes', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.expirySourceTypes, `'expirySourceTypes' is not defined`);
						});

						it('should be an object', () => {
							assert.isObject(createMarketForm.expirySourceTypes, `'expirySourceTypes' is not an object`);
						});

						describe('generic', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.expirySourceTypes.generic, `'expirySourceTypes.generic' is not defined`);
							});

							it('should be a string', () => {
								assert.isString(createMarketForm.expirySourceTypes.generic, `'expirySourceTypes.generic' is not a string`);
							});
						});

						describe('specific', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.expirySourceTypes.specific, `'expirySourceTypes.specific' is not defined`);
							});

							it('should be a string', () => {
								assert.isString(createMarketForm.expirySourceTypes.specific, `'expirySourceTypes.specific' is not a string`);
							});
						});
					});

					break;
				case 4:
					describe('takerFee', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.takerFee, `'takerFee' is not defined`);
						});

						it('should be a number', () => {
							assert.isNumber(createMarketForm.takerFee, `'takerFee' is not a number`);
						});
					});

					describe('makerFee', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.makerFee, `'makerFee' is not defined`);
						});

						it('should be a number', () => {
							assert.isNumber(createMarketForm.makerFee, `'makerFee' is not a number`);
						});
					});

					if (createMarketForm.isCreatingOrderBook) {
						describe('initialLiquidity', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.initialLiquidity, `'initialLiquidity' is not defined`);
							});

							it('should be a number', () => {
								assert.isNumber(createMarketForm.initialLiquidity, `'initialLiquidity' is not a number`);
							});
						});

						describe('initialFairPrices', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.initialFairPrices, `'initialFairPrices' is not defined`);
							});

							it('should be an object', () => {
								assert.isObject(createMarketForm.initialFairPrices, `'initialFairPrices' is not an object`);
							});

							it('should have the correct shape', () => {
								assertInitialFairPrices(createMarketForm.initialFairPrices, 'createMarketForm');
							});
						});

						describe('bestStartingQuantity', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.bestStartingQuantity, `'bestStartingQuantity' is not defined`);
							});

							it('should be a number', () => {
								assert.isNumber(createMarketForm.bestStartingQuantity, `'bestStartingQuantity' is not a number`);
							});
						});

						describe('startingQuantity', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.startingQuantity, `'startingQuantity' is not defined`);
							});

							it('should be a number', () => {
								assert.isNumber(createMarketForm.startingQuantity, `'startingQuantity' is not a number`);
							});
						});

						describe('priceWidth', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.priceWidth, `'priceWidth' is not defined`);
							});

							it('should be a number', () => {
								assert.isNumber(createMarketForm.priceWidth, `'priceWidth' is not a number`);
							});
						});

						describe('priceDepth', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.priceDepth, `'priceDepth' is not defined`);
							});

							it('should be a number', () => {
								assert.isNumber(createMarketForm.priceDepth, `'priceDepth' is not a number`);
							});
						});
					}

					break;
				default:
				case 5:
					describe('description', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.description, `'description' is not defined`);
						});

						it('should be a string', () => {
							assert.isString(createMarketForm.description, `'description' is not a string`);
						});
					});

					describe('outcomes', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.outcomes, `'outcomes' is not defined`);
						});

						it('should be an array', () => {
							assert.isArray(createMarketForm.outcomes, `'outcomes' is not an array`);
						});
					});

					describe('endDate', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.endDate, `'endDate' is not defined`);
						});

						it('should be an object', () => {
							assert.isObject(createMarketForm.endDate, `'endDate' is not an object`);
						});

						it('should have the correct shape', () => {
							assertFormattedDate(createMarketForm.endDate, 'createMarketForm');
						});
					});

					describe('takerFeePercent', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.takerFeePercent, `'takerFeePercent' is not defined`);
						});

						it('should be an object', () => {
							assert.isObject(createMarketForm.takerFeePercent, `'takerFeePercent' is not an object`);
						});

						it('should have the correct shape', () => {
							assertFormattedNumber(createMarketForm.takerFeePercent, 'createMarketForm.takerFeePercent');
						});
					});

					describe('makerFeePercent', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.makerFeePercent, `'makerFeePercent' is not defined`);
						});

						it('should be an object', () => {
							assert.isObject(createMarketForm.makerFeePercent, `'makerFeePercent' is not an object`);
						});

						it('should have the correct shape', () => {
							assertFormattedNumber(createMarketForm.makerFeePercent, 'createMarketForm.makerFeePercent');
						});
					});

					describe('creatingMarket', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.creatingMarket, `'creatingMarket' is not defined`);
						});

						it('should be a boolean', () => {
							assert.isBoolean(createMarketForm.creatingMarket, `'creatingMarket' is not a boolean`);
						});
					});

					describe('volume', () => {
						it('should be defined', () => {
							assert.isDefined(createMarketForm.volume, `'volume' is not defined`);
						});

						it('should be an object', () => {
							assert.isObject(createMarketForm.volume, `'volume' is not an object`);
						});

						it('should have the correct shape', () => {
							assertFormattedNumber(createMarketForm.volume, 'createMarketForm.volume');
						});
					});

					if (createMarketForm.isCreatingOrderBook) {
						describe('initialFairPrices', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.initialFairPrices, `'initialFairPrices' is not defined`);
							});

							it('should be an object', () => {
								assert.isObject(createMarketForm.initialFairPrices, `'initialFairPrices' is not an object`);
							});

							it('should have the correct shape', () => {
								assertInitialFairPrices(createMarketForm.initialFairPrices, 'createMarketForm.initialFairPrices');
							});
						});

						describe('priceWidthFormatted', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.initialLiquidityFormatted, `'initialLiquidityFormatted' is not defined`);
							});

							it('should be an object', () => {
								assert.isObject(createMarketForm.initialLiquidityFormatted, `'initialLiquidityFormatted' is not an object`);
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(createMarketForm.initialLiquidityFormatted, 'createMarketForm.initialLiquidityFormatted');
							});
						});

						describe('priceWidthFormatted', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.priceWidthFormatted, `'priceWidthFormatted' is not defined`);
							});

							it('should be an object', () => {
								assert.isObject(createMarketForm.priceWidthFormatted, `'priceWidthFormatted' is not an object`);
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(createMarketForm.priceWidthFormatted, 'createMarketForm.priceWidthFormatted');
							});
						});

						describe('bestStartingQuantityFormatted', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.bestStartingQuantityFormatted, `'bestStartingQuantityFormatted' is not defined`);
							});

							it('should be an object', () => {
								assert.isObject(createMarketForm.bestStartingQuantityFormatted, `'bestStartingQuantityFormatted' is not an object`);
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(createMarketForm.bestStartingQuantityFormatted, 'createMarketForm.bestStartingQuantityFormatted');
							});
						});

						describe('startingQuantityFormatted', () => {
							it('should be defined', () => {
								assert.isDefined(createMarketForm.startingQuantityFormatted, `'startingQuantityFormatted' is not defined`);
							});

							it('should be an object', () => {
								assert.isObject(createMarketForm.startingQuantityFormatted, `'startingQuantityFormatted' is not an object`);
							});

							it('should have the correct shape', () => {
								assertFormattedNumber(createMarketForm.startingQuantityFormatted, 'createMarketForm.startingQuantityFormatted');
							});
						});
					}
			}
		});
	});
}
