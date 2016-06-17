import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Checkbox = (p) => (
	<span
		className={classnames('checkbox', p.className, { checked: p.isChecked })}
		title={p.title}
	>
		<span className="checkbox-box" onClick={p.onClick} />
		<span
			className="checkbox-label"
			maxLength={p.maxLength}
			tabIndex={p.tabIndex}
			onClick={p.onClick}
		>
			{p.text}
		</span>
	</span>
);

Checkbox.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	text: PropTypes.string,
	isChecked: PropTypes.bool,
	tabIndex: PropTypes.number,
	onClick: PropTypes.func
};

export default Checkbox;
