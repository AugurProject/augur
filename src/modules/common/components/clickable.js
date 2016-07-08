/*
 * Provides clickable wrapper (default is span) with pointer cursor.
 * Author: priecint
 */
import React, { Component, PropTypes } from 'react';

export default class Clickable extends Component {
	static propTypes = {
		onClick: PropTypes.func,
		component: PropTypes.any,
		children: PropTypes.any
	};
	static defaultProps = {
		component: 'span'
	};
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick = event => {
		if (typeof this.props.onClick === 'function') {
			this.props.onClick(event);
		}
	}

	render() {
		return (
			React.createElement(
				this.props.component,
				{
					className: 'clickable',
					onClick: this.onClick
				},
				this.props.children
			)
		);
	}
}
