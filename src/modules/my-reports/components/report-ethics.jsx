import React from 'react';

const ReportEthics = p => (
	<span className={p.className}>
		{!!p.isUnethical &&
			<span
				className="fa report-unethical"
				data-tip="You reported that this market is unethical"
			>
				&#xf165;
			</span>
		}
	</span>
);

ReportEthics.propTypes = {
	className: React.PropTypes.string,
	isUnethical: React.PropTypes.bool
};

export default ReportEthics;
