let React = require("react");
let utilities = require("../../libs/utilities");
let Highstock = require("react-highcharts/bundle/highstock");

let StatsTab = React.createClass({
    shouldComponentUpdate(nextProps, nextState) {
        var thisSeries = this.props.priceTimeSeries;
        var nextSeries = nextProps.priceTimeSeries;
        if (thisSeries && nextSeries) {
            if (nextSeries.length !== thisSeries.length) return true;
            for (var i = 0, len = thisSeries.length; i < len; ++i) {
                if (nextSeries[i].data.length !== thisSeries[i].data.length) {
                    return true;
                }
            }
            return false;
        }
        return true;
    },
    render() {
        let priceTimeSeries = this.props.priceTimeSeries;
        let config = {
            chart: {
                renderTo: "highstock",
                height: 400,
                marginRight: 22,
                marginBottom: 10,
                reflow: true
            },
            rangeSelector: {selected: 1},
            yAxis: {
                title: {
                    text: "price"
                },
                min: 0,
                max: 1.05,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: "#808080"
                }]
            },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
                borderWidth: 0
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2
            },
            series: priceTimeSeries
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
