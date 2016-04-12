import React from 'react';

module.exports = React.createClass({
	propTypes: {
		disabled: React.PropTypes.bool,

		nextLabel: React.PropTypes.string,
		prevLabel: React.PropTypes.string,

		onPrev: React.PropTypes.func,
		onNext: React.PropTypes.func
	},

	render: function() {
		var p = this.props;
		return (
			<div className="buttons">
				<button
					className="button prev"
					type="button"
					onClick={ p.onPrev }>{ p.prevLabel || 'back' }</button>

				<button
					className="button next"
					type="button"
					disabled={ p.disabled }
					onClick={ !p.disabled && p.onNext }>{ p.nextLabel || 'Next' }</button>
			</div>
		);
	}
});