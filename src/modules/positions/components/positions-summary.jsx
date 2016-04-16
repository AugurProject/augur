import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string
    },
    render: function() {
        var p = this.props;
        return (
			<div className={ classnames('positions-summary', p.className) }>
				{ !!p.numPositions &&
					<ValueDenomination { ...p.numPositions } className="num-positions" />
				}

				{ p.totalValue &&
					<ValueDenomination { ...p.totalValue } className="total-value" />
				}

				{ p.gainPercent &&
					<span>
						(<ValueDenomination
							{ ...p.gainPercent }
							formatted={ p.gainPercent.formatted } className="gain-percent" />)
					</span>
				}
			</div>
        );
    }
});