import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Checkbox = p => (
	<span className={classnames('checkbox', p.className, { checked: p.isChecked })} title={p.title}>
		<button className="checkbox-box" onClick={p.onClick} />
		<button className="checkbox-label" tabIndex={p.tabIndex} onClick={p.onClick}>
			{p.text}
		</button>
		{p.text2 != null &&
			<button className="checkbox-label2" onClick={p.onClick}>
				{p.text2}
			</button>
		}
	</span>
);

Checkbox.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	text: PropTypes.string,
	text2: PropTypes.string,
	isChecked: PropTypes.bool,
	tabIndex: PropTypes.number,
	onClick: PropTypes.func
};

export default Checkbox;
