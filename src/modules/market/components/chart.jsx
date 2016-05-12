import React from 'react';

import ReactHighcharts from 'react-highcharts';

module.exports = React.createClass({
    propTypes: {
        series: React.PropTypes.array
    },

    /**
     * Update when series are not of same length or if last values are not the same.
     * Inspired by code from old develop branch
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @return {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        var thisSeries = this.props.series;
        var nextSeries = nextProps.series;

        if (thisSeries === nextSeries) {
            return false;
        }

        if (thisSeries && nextSeries) {
            if (nextSeries.length !== thisSeries.length) return true;
            var thisDataLength, nextDataLength;
            for (var i = 0, len = thisSeries.length; i < len; ++i) {
                thisDataLength = thisSeries[i].data.length;
                nextDataLength = nextSeries[i].data.length;
                if (thisDataLength !== nextDataLength) {
                    return true;
                }

                if (thisSeries[i].data[thisDataLength-1].price !== nextSeries[i].data[nextDataLength-1].price) {
                    return true;
                }
            }
            return false;
        }
        return true;
    },

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