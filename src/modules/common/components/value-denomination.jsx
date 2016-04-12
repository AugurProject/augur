import React from 'react';
import classnames from 'classnames';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,

		value: React.PropTypes.number,
		formatted: React.PropTypes.string,
		denomination: React.PropTypes.string,
		minimized: React.PropTypes.string,

		isMinimized: React.PropTypes.bool,
		isRounded: React.PropTypes.bool,
		isColorized: React.PropTypes.bool
	},

	render: function() {
	    var p = this.props,
	    	displayValue,
	    	colorizeClass = '';

	    if (p.isRounded) {
	    	displayValue = p.rounded;
	    }
	    else if (p.isMinimized) {
	    	displayValue = p.minimized;
	    }
	    else {
	    	displayValue = p.formatted;
	    }

	    if (p.isColorized) {
	    	if (p.formattedValue > 0) {
	    		colorizeClass = 'positive';
	    	}
	    	else if (p.formattedValue < 0) {
	    		colorizeClass = 'negative';
	    	}
	    }

		return (
			<span className={ classnames('value-denomination', p.className, colorizeClass) } title={ p.value }>
				<span className="value">{ displayValue }</span>
				<span className="denomination">{ p.denomination }</span>
			</span>
		);
	}
});