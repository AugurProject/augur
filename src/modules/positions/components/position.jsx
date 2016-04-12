import React from 'react';
import classnames from 'classnames';

module.exports = React.createClass({
    propTypes: {
		rowspan: React.PropTypes.number,
		description: React.PropTypes.string,
		outcomeName: React.PropTypes.string,

		qtyShares: React.PropTypes.object,
		totalValue: React.PropTypes.object,
		gainPercent: React.PropTypes.object,
		lastPrice: React.PropTypes.object,
		purchasePrice: React.PropTypes.object,
		shareChange: React.PropTypes.object,
		totalCost: React.PropTypes.object,
		netChange: React.PropTypes.object,
    },

    render: function() {
        var p = this.props;
        return (
            <tr className={ classnames(p.gainPercent.value >= 0 ? 'positive' : 'negative') }>
                { p.description &&
                    <td className="description" rowSpan={ p.rowspan }>{ p.description }</td>
                }
                <td className="outcome">{ p.outcomeName }</td>

                <td className="qty">{ p.qtyShares.minimized }</td>
                <td className="gain">{ p.gainPercent.full }</td>

                <td className="last">{ p.lastPrice.full }</td>
                <td className="purchase">{ p.purchasePrice.full }</td>
                <td className="change">{ p.shareChange.full }</td>

                <td className="cost">{ p.totalCost.full }</td>
                <td className="value">{ p.totalValue.full }</td>
                <td className="net">{ p.netChange.full }</td>
                <td className="buttons">
                    <button className="button trade">Trade</button>
                </td>
            </tr>
        );
    }
});