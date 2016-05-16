import React from 'react';

import shouldComponentUpdate from '../../../utils/should-component-update-pure';

import ReactHighcharts from 'react-highcharts';

module.exports = React.createClass({
    propTypes: {
        series: React.PropTypes.array
    },

    shouldComponentUpdate: shouldComponentUpdate,

    render: function() {
        var p = this.props;
        let config = {
            title: {
                text: "Price history"
            },
            rangeSelector: {selected: 1},
            xAxis: {
                type: "datetime"
            },
            yAxis: {
                title: {
                    text: "price"
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
            <div>
                <ReactHighcharts
                    config={config}>
                </ReactHighcharts>

            </div>
        );
    }
});