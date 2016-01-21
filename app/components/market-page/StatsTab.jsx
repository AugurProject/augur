let React = require('react');

let utilities = require("../../libs/utilities");

let Highstock = require("react-highcharts/bundle/highstock");

let StatsTab = React.createClass({
    render() {
        let market = this.props.market;

        let numPoints = {yes: 0, no: 0};
        if (market.priceHistory) {
            if (market.priceHistory[2] && market.priceHistory[2].length) {
                numPoints.yes = market.priceHistory[2].length;
            }
            if (market.priceHistory[1] && market.priceHistory[1].length) {
                numPoints.no = market.priceHistory[1].length;
            }
        }
        let data = {
            yes: new Array(numPoints.yes),
            no: new Array(numPoints.no)
        };
        let block = this.props.blockNumber;
        for (let i = 0; i < numPoints.yes; ++i) {
            data.yes[i] = [
                utilities.blockToDate(market.priceHistory[2][i].blockNumber, block).unix() * 1000,
                Number(market.priceHistory[2][i].price)
            ];
        }
        for (let i = 0; i < numPoints.no; ++i) {
            data.no[i] = [
                utilities.blockToDate(market.priceHistory[1][i].blockNumber, block).unix() * 1000,
                Number(market.priceHistory[1][i].price)
            ];
        }
        let seriesOptions = [
            {name: "Yes", data: data.yes, color: "#4422CE"},
            {name: "No", data: data.no, color: "#D00030"}
        ];
        let config = {
            chart: {
                renderTo: "highstock",
                height: 250,
                marginRight: 22,
                marginBottom: 10,
                reflow: true
            },
            rangeSelector: {selected: 1},
            yAxis: {
                title: {
                    text: 'price'
                },
                min: 0,
                max: 1,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2
            },
            series: seriesOptions
        };

        return (
            <div className="row">
                <div className="col-xs-12">
                    <Highstock
                        id="highchart"
                        className='price-chart'
                        config={config}>
                    </Highstock>
                </div>
            </div>
        );
    }
});

module.exports = StatsTab;