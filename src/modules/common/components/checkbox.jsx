import React from 'react';
import classnames from 'classnames';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,

		title: React.PropTypes.string,
		text: React.PropTypes.string,
		isChecked: React.PropTypes.bool,
		tabIndex: React.PropTypes.number,

		onClick: React.PropTypes.func
	},

	render: function() {
	    var p = this.props;

		return (
			<span
				className={ classnames('checkbox', p.className, { 'checked': p.isChecked }) }
				title={ p.title }>

				<span
					className="checkbox-box"
					onClick={ p.onClick } />

				<span
					className="checkbox-label"
					maxLength={ p.maxLength }
					tabIndex={ p.tabIndex }
					onClick={ p.onClick }>{ p.text }</span>
			</span>
		);
	}
});