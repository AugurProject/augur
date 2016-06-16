/*
 * Provides collapsible wrapper (default is div)
 *
 * Author: priecint
 */

import React from 'react';
import classnames from 'classnames';

export const Collapse = React.createClass({
	propTypes: {
		isOpen: React.PropTypes.bool,
		component: React.PropTypes.any
	},

	getDefaultProps() {
		return {
			component: 'div'
		}
	},

	render() {
		return (
			React.createElement(
				this.props.component,
				{
					className: classnames('collapse', { 'displayNone': !this.props.isOpen }),
					onClick: this.onClick
				},
				this.props.children
			)
		);
	}
});