import React from 'react';
import classnames from 'classnames';

import Position from './position';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
		positions: React.PropTypes.array
    },
    render: function() {
        var p = this.props;
        return (
            <div className={ classnames(p.className) }>
                <table className="positions-table">
                    <thead>
                        <tr>
                            <th className="description">Market</th>
                            <th className="outcome">Position</th>
                            <th className="qty">Qty</th>
                            <th className="gain">Gain</th>

                            <th className="last">Last</th>
                            <th className="purchase">Purchased</th>
                            <th className="change">Change</th>

                            <th className="cost">Cost</th>
                            <th className="value">Value</th>
                            <th className="net">Net</th>

                            <th className="buttons"></th>
                        </tr>
                    </thead>
                    <tbody>
                        { (p.positions || []).map(position =>
                            <Position
                                key={ position.marketID + '-' + position.outcomeID }
                        		{ ...position } />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
});