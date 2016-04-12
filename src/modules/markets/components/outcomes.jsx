import React from 'react';
import classnames from 'classnames';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import ValueDenomination from '../../common/components/value-denomination';

module.exports = React.createClass({
    propTypes: {
		outcomes: React.PropTypes.array,
		isRounded: React.PropTypes.bool
    },

    shouldComponentUpdate: shouldComponentUpdatePure,

    render: function() {
        var p = this.props;
        return (
            <div className="outcomes">
                { p.outcomes.map((outcome, i) => (
                    <div key={ outcome.id } className="outcome">
                        <ValueDenomination className="outcome-price" { ...outcome.pricePercent } isRounded={ p.isRounded } isColorized={ true } />
                        <span className="outcome-name">{ outcome.name }</span>
                    </div>
                ))}
            </div>
        );
    }
});