import {
    TRADING_FEE_DEFAULT,
    MAKER_FEE_DEFAULT,
    INITIAL_LIQUIDITY_DEFAULT,
    INITIAL_FAIR_PRICE_DEFAULT,
    SHARES_PER_ORDER_DEFAULT,
    SIZE_OF_BEST_DEFAULT,
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
        makerFeePercent: MAKER_FEE_DEFAULT,
        initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,

        // Advanced Market Creation
        defaultFairPrice: INITIAL_FAIR_PRICE_DEFAULT,

        initialFairPrice: [],
        sharesPerOrder: SHARES_PER_ORDER_DEFAULT,
        sizeOfBest: SIZE_OF_BEST_DEFAULT,
        priceWidth: PRICE_WIDTH_DEFAULT,
        separation: SEPARATION_DEFAULT,

        onValuesUpdated: newValues => updateForm(newValues)
    };

    return form

    function updateForm(newValues){
        if(newValues.step === 4){
            switch(form.type){
                case BINARY:
                    setInitialFairPrice(['Yes', 'No']);

                    break;
                case SCALAR:
                    setInitialFairPrice(['⇧', '⇩']);

                    break;
                case CATEGORICAL:
                    let labels = [];

                    form.categoricalOutcomes.map((val, i) => {
                        labels[i] = val;
                    });

                    setInitialFairPrice(labels)

                    break;
            }

            function setInitialFairPrice(labels){
                form.initialFairPrice = [];

                labels.map((cV, i) => {
                    form.initialFairPrice[i] = {
                        label: cV,
                        value: form.defaultFairPrice
                    }
                })
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