import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Toggler = (p) => {
	return (
		<div
			className={classnames('clickable', 'toggler', p.className)}
			onClick={(e) => {
				e.persist();
				p.onClick(findNextOption(p.selected, p.options), e);
			}}
		>
			{p.selected.label}
		</div>
	);

};

const findNextOption = (selected, options) => {
	const currentSelectedIndex = options.indexOf(selected);
	let nextSelectedInex = currentSelectedIndex + 1;
	if (nextSelectedInex >= options.length) {
		nextSelectedInex = 0;
	}
	return options[nextSelectedInex];
};

Toggler.propTypes = {
	className: PropTypes.string,
	selected: PropTypes.object,
	options: PropTypes.array,
	onClick: PropTypes.func
};

export default Toggler;
