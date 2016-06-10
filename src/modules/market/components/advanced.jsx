import React from 'react';

import ValueDenomination from '../../common/components/value-denomination'

module.exports = React.createClass({
    propsTypes: {
        initialFairPrices: React.PropTypes.object,
        bestStartingQuantityFormatted: React.PropTypes.any,
        startingQuantityFormatted: React.PropTypes.any,
        priceWidthFormatted: React.PropTypes.any
    },
    
    render: function() {
        let p = this.props;

        console.log('p -- ', p)

        return(
            <section className="advanced">
                <ul className="properties">
                    <li className="property fee">
                        <span className="property-label">initial prices: </span>
                        <span>
                            {
                                p.initialFairPrices.values.map((cV, i, arr) => {
                                    return (
                                        <div className="distinct">
                                            <ValueDenomination className="property-value" { ...p.initialFairPrices.formatted[`${i}`] } />
                                        </div>
                                    )
                                })
                            }
                        </span>
                    </li>
                    <li className="property">
                        <span className="property-label">best starting quantity</span>
                        <ValueDenomination className="property-value" { ...p.bestStartingQuantityFormatted } />
                    </li>
                    <li className="property">
                        <span className="property-label">starting quantity</span>
                        <ValueDenomination className="property-value" { ...p.startingQuantityFormatted } />
                    </li>
                    <li className="property">
                        <span className="property-label">price width</span>
                        <ValueDenomination className="property-value" { ...p.priceWidthFormatted } />
                    </li>
                </ul>
            </section>
        )
    }
});