import React from 'react';

module.exports = React.createClass({
	propTypes: {
		str: React.PropTypes.string
	},

	render: function() {
		var p = this.props;
		return (
			<div className="combinatorial"></div>
		);
	}
});