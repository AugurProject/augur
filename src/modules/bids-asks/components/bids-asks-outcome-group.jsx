import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
		bids: React.PropTypes.array,
		asks: React.PropTypes.array
    },

    render: function() {
        var p = this.props;
        return (
            <div className="bids-asks-group">
                <h5>
                    <span className="name-header">{ p.name }</span>
                    <br />
                    <span className="bids-header">Bids</span>
                    <span className="asks-header">Asks</span>
                </h5>
                <div className="bids">
                    { p.bids.map((bid, i) => (
                        <article key={ bid.price.full } className="bid-ask bid">
                            <ValueDenomination className="shares" { ...bid.shares } isColorized={ i === 0 } />
                            <ValueDenomination className="price" { ...bid.price } isColorized={ i === 0 } />
                        </article>
                    ))}
                    { !p.bids.length &&
						<article className="bid-ask ask">
                            <ValueDenomination className="price" />
                            <ValueDenomination className="shares" formatted="-" />
                        </article>
                    }
                </div>
                <div className="asks">
                    { p.asks.map((ask, i) => (
                        <article key={ ask.price.full } className="bid-ask ask">
                            <ValueDenomination className="price" { ...ask.price } isColorized={ i === 0 } />
                            <ValueDenomination className="shares" { ...ask.shares } isColorized={ i === 0 } />
                        </article>
                    ))}
                    { !p.asks.length &&
						<article className="bid-ask ask">
                            <ValueDenomination className="price" formatted="-" />
                            <ValueDenomination className="shares" />
                        </article>
                    }
                </div>
            </div>
        );
    }
});