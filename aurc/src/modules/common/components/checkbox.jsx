import React, { PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';

const Checkbox = p => (
	<article className="checkbox-container">
		<button
			className={classnames('checkbox unstyled', p.className, { checked: p.isChecked })}
			type="button"
			data-tip={p.title}
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
		<ReactTooltip type="light" effect="solid" place="top" />
	</article>
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
