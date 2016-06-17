/*
 * Provides collapsible wrapper (default is div)
 *
 * Author: priecint
 */
import { React, PropTypes } from 'react';
import classnames from 'classnames';

const Collapse = (props) => (
	React.createElement(
		this.props.component,
		{
			className: classnames('collapse', { displayNone: !this.props.isOpen }),
			onClick: this.onClick
		},
		this.props.children
	)
);

Collapse.propTypes = {
	isOpen: PropTypes.bool,
	component: PropTypes.any,
	children: PropTypes.any
};

Collapse.defaultProps = {
	component: 'div'
};

export default Collapse;
