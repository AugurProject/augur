import React from 'react';
import classnames from 'classnames';

import Position from './position';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
		outcomes: React.PropTypes.array
    },
    render: function() {
        var p = this.props;
        return (
            <section className="positions-list">
                { (p.outcomes || []).map(outcome =>
                    <Position
                        key={ outcome.id }
                		{ ...outcome }
                		{ ...outcome.position } />
                )}
            </section>
        );
    }
});