import {
    TRADING_FEE_DEFAULT,
    MAKER_FEES_DEFAULT,
    INITIAL_LIQUIDITY_DEFAULT,
    INITIAL_FAIR_PRICE_DEFAULT,
    STARTING_QUANTITY_DEFAULT,
    BEST_STARTING_QUANTITY_DEFAULT,
    PRICE_WIDTH_DEFAULT,
    SEPARATION_DEFAULT
} from '../modules/create-market/constants/market-values-constraints'

import { BINARY, CATEGORICAL, SCALAR } from '../modules/markets/constants/market-types';

import { makeNumber } from '../utils/make-number'

module.exports = createMarketForm();

function createMarketForm(){
    let form = {
        step: 1,
        errors: {},

        isValid: true,

        tradingFeePercent: TRADING_FEE_DEFAULT,
        makerFees: MAKER_FEES_DEFAULT,
        initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,

        // Advanced Market Creation
        defaultFairPrice: INITIAL_FAIR_PRICE_DEFAULT,

        initialFairPrices: {},
        startingQuantity: STARTING_QUANTITY_DEFAULT,
        bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
        priceWidth: PRICE_WIDTH_DEFAULT,
        separation: SEPARATION_DEFAULT,

        onValuesUpdated: newValues => updateForm(newValues)
    };

    return form;

    function updateForm(newValues){
        if(newValues.step === 4){
            switch(form.type){
                case BINARY:
                    setInitialFairPrices(['Yes', 'No'], BINARY);
                    break;
                case SCALAR:
                    setInitialFairPrices(['⇧', '⇩'], SCALAR);
                    break;
                case CATEGORICAL:
                    let labels = [];

                    form.categoricalOutcomes.map((val, i) => {
                        labels[i] = val;
                    });

                    setInitialFairPrices(labels, CATEGORICAL);
                    break;
            }

            function setInitialFairPrices(labels, type){
                form.initialFairPrices = {
                    type,
                    values: [],
                    raw: []
                };

                labels.map((cV, i) => {
                    form.initialFairPrices.values[i] = {
                        label: cV,
                        value: INITIAL_FAIR_PRICE_DEFAULT
                    };
                    form.initialFairPrices.raw[i] = INITIAL_FAIR_PRICE_DEFAULT;
                });
            }
        }

        if(newValues.step === 5){
            form.tradingFeePercent = makeNumber(form.tradingFeePercent, '%')
            form.volume = makeNumber(0)
        }

        form = {
            ...form,
            ...newValues
        };

        require('../selectors').update({ createMarketForm: form });
    }
}