import React from 'react';
import classnames from 'classnames';

const ValueDenomination = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		value: React.PropTypes.number,
		formattedValue: React.PropTypes.number,
		formatted: React.PropTypes.string,
		denomination: React.PropTypes.string
	},

	render: function() {
	    var p = this.props;
		return (
			<span
				className={ classnames('value-denomination', p.className, { 'positive': p.formattedValue > 0, 'negative': p.formattedValue < 0 }) }
				title={`${p.title}: ${p.value} ${p.denomination}`}>

				{ (p.formatted) &&
					<span className="value">{ p.formatted }</span>
				}
				{ p.denomination &&
					<span className="denomination">{ p.denomination }</span>
				}
			</span>
		);
	}
});

module.exports = ValueDenomination;