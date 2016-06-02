import {
    INITIAL_FAIR_PRICE_DEFAULT,
    SHARES_PER_ORDER_DEFAULT,
    SIZE_OF_BEST_DEFAULT,
    PRICE_WIDTH_DEFAULT,
    SEPARATION_DEFAULT
} from '../modules/create-market/constants/market-values-constraints'

module.exports = createMarketForm();

function createMarketForm(){
    let form = {
        step: 1,
        errors: {},

        isValid: true,

        // Advanced Market Creation
        defaultFairPrice: INITIAL_FAIR_PRICE_DEFAULT,

        initialFairPrice: [],
        sharesPerOrder: SHARES_PER_ORDER_DEFAULT,
        sizeOfBest: SIZE_OF_BEST_DEFAULT,
        priceWidth: PRICE_WIDTH_DEFAULT,
        separation: SEPARATION_DEFAULT,

        onValuesUpdated: newValues => updateForm(newValues)
    }

    return form

    function updateForm(newValues){
        form = {
            ...form,
            ...newValues
        }

        require('../selectors').update({ createMarketForm: form })
    }
}

