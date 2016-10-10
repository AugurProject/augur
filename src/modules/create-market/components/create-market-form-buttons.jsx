import React, { PropTypes } from 'react';

const CreateMarketFormButtons = p => (
	<div className="buttons">
		<button
			className="button prev"
			type="button"
			onClick={p.onPrev}
		>
			{p.prevLabel || 'back'}
		</button>

		<button
			className="button next"
			type="button"
			disabled={p.disabled}
			onClick={!p.disabled && p.onNext}
		>
			{p.nextLabel || 'Next'}
		</button>
	</div>
);

CreateMarketFormButtons.propTypes = {
	disabled: PropTypes.bool,
	nextLabel: PropTypes.string,
	prevLabel: PropTypes.string,
	onPrev: PropTypes.func,
	onNext: PropTypes.func
};

export default CreateMarketFormButtons;
