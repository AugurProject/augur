// Provides collapsible wrapper (default is div)
import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Collapse = (props) => (
	React.createElement(
		props.component,
		{
			className: classnames('collapse', { displayNone: !props.isOpen })
		},
		props.children
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
