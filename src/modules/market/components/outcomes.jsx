import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import ValueDenomination from '../../common/components/value-denomination';

module.exports = React.createClass({
    propTypes: {
		outcomes: React.PropTypes.array
    },

    shouldComponentUpdate: shouldComponentUpdatePure,

    render: function() {
        var p = this.props;
        return (
            <div className="outcomes">
                { p.outcomes.map((outcome, i) => (
                    <div key={ outcome.id } className="outcome">
                        { !!outcome.lastPricePercent &&
                            <ValueDenomination
                                className="outcome-price"
                                { ...outcome.lastPricePercent }
                                formatted={ outcome.lastPricePercent.rounded }
                                formattedValue={ outcome.lastPricePercent.roundedValue } />
                        }
                        <span className="outcome-name">{ outcome.name }</span>
                    </div>
                ))}
            </div>
        );
    }
});