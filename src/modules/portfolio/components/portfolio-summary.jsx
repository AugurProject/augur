import React from 'react';
import SummaryItem from '../../../modules/portfolio/components/summary-item';


const PortfolioSummary = () => {
	const placeholders = [
		{
			label: 'Total Value',
			value: '212.38 ETH'
		},
		{
			label: 'Total Gain/Loss',
			value: '+9.5 ETH'
		},
		{
			label: 'Fees Paid',
			value: '0.201 ETH'
		},
		{
			label: 'Fees Earned',
			value: '1.77 ETH'
		},
	]

	return (
		<div className="portfolio-summary" >
			{placeholders.map((placeholder, i) => (
				<SummaryItem
					key={`${placeholder.label}-${i}`}
					label={placeholder.label}
					value={placeholder.value}
				/>
			))}
		</div>
	)
};

export default PortfolioSummary;