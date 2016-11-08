import React, { Component } from 'react';

import ComponentNav from 'modules/common/components/component-nav';
import ReportForm from 'modules/reports/components/report-form';
import MarketDetails from 'modules/market/components/market-details';

import { MARKET_REPORTING_NAV_REPORT, MARKET_REPORTING_NAV_DETAILS } from 'modules/app/constants/views';

import getValue from 'utils/get-value';

export default class ReportPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedNav: MARKET_REPORTING_NAV_REPORT
		};

		this.updateSelectedNav = this.updateSelectedNav.bind(this);
	}

	updateSelectedNav(selectedNav) {
		this.setState({ selectedNav });
	}

	render() {
		const p = this.props;
		const s = this.state;

		const market = getValue(p, 'market');

		return (
			<article className="report-panel" >
				<h3>{market.description}</h3>
				<ComponentNav
					navItems={p.marketReportingNavItems}
					selectedNav={s.selectedNav}
					updateSelectedNav={this.updateSelectedNav}
				/>
				{s.selectedNav === MARKET_REPORTING_NAV_REPORT &&
					<ReportForm
						{...market}
						isReported={market.isReported || market.isReportSubmitted}
						onClickSubmit={market.onSubmitReport}
					/>
				}
				{s.selectedNav === MARKET_REPORTING_NAV_DETAILS &&
					<MarketDetails {...market} />
				}
			</article>
		);
	}
}
