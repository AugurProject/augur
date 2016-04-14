import React from 'react';
import classnames from 'classnames';

import Link from '../../link/components/link';

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

		marketLink: React.PropTypes.object
    },

    render: function() {
        var p = this.props;
        return (
            <tr>
                { p.description &&
                    <td className="description" rowSpan={ p.rowspan }>{ p.description }</td>
                }
                <td className="outcome">{ p.outcomeName }</td>

                <td className="qty">{ p.qtyShares && p.qtyShares.minimized }</td>
                <td className="gain">{ p.gainPercent && p.gainPercent.full }</td>

                <td className="last">{ p.lastPrice && p.lastPrice.full }</td>
                <td className="purchase">{ p.purchasePrice && p.purchasePrice.full }</td>
                <td className="change">{ p.shareChange && p.shareChange.full }</td>

                <td className="cost">{ p.totalCost && p.totalCost.full }</td>
                <td className="value">{ p.totalValue && p.totalValue.full }</td>
                <td className="net">{ p.netChange && p.netChange.full }</td>
                <td className="buttons">
                    <Link { ...p.marketLink } className={ classnames('button', p.marketLink.className) }>{ p.marketLink.text }</Link>
                </td>
            </tr>
        );
    }
});