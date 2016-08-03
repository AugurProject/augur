import React, { Component, PropTypes } from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';
import ReactHighcharts from 'react-highcharts';

export default class Chart extends Component {
	static propTypes = {
		series: PropTypes.array
	};

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = shouldComponentUpdatePure;
	}

	render() {
		const p = this.props;
		const config = {
			title: {
				text: ''
			},
			rangeSelector: { selected: 1 },
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text: 'price'
				},
				min: 0,
				max: 1
			},
			legend: {
				enabled: true
			},
			tooltip: {
				pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
				valueDecimals: 2
			},
			series: p.series
		};

		return (
			<section className="price-history-chart">
				<div className="market-section-header">
					Price History
				</div>
				<ReactHighcharts config={config} />
			</section>
		);
	}
}
