import React from 'react';
import classnames from 'classnames';

import BidsAsksOutcomeGroup from './bids-asks-outcome-group';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
		bidsAsks: React.PropTypes.array
    },

    render: function() {
        var p = this.props;
        return (
            <div className={ p.className }>
                { p.bidsAsks.map(outcomeBidsAsks => (
                    <BidsAsksOutcomeGroup
                        key={ outcomeBidsAsks.id }
                        { ...outcomeBidsAsks } />
                ))}
            </div>
        );
    }
});