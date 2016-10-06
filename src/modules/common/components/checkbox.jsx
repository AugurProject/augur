import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Checkbox = p => (
	<button
		className={classnames('checkbox unstyled', p.className, { checked: p.isChecked })}
		title={p.title}
		onClick={p.onClick}
	>
		<span className="checkbox-box" />
		<span className="checkbox-label" tabIndex={p.tabIndex} >
			{p.text}
		</span>
		{p.text2 != null &&
			<span className="checkbox-label2" >
				{p.text2}
			</span>
		}
	</button>
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
