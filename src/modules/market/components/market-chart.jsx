import React, { Component, PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';

export default class MarketChart extends Component {
	static propTypes = {
		series: PropTypes.array
	};

	shouldComponentUpdate(nextProps) {
		if (nextProps.series.length === this.props.series.length) return false;

		return true;
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
			<article className="price-history-chart">
				<h3>Market Price History</h3>
				<ReactHighcharts config={config} />
			</article>
		);
	}
}
