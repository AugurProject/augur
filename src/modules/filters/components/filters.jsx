import React from 'react';
import classnames from 'classnames';

import Checkbox from '../../common/components/checkbox';

module.exports = React.createClass({
    propTypes: {
        filters: React.PropTypes.array
    },

    render: function() {
        var p = this.props;
        return (
            <aside className="filters">
                { p.filters.map(filter =>
                    <div key={ filter.title } className="filters-group">
                        <span className="title">{ filter.title }</span>
                        { filter.options.map(option =>
                            <Checkbox key={ option.value } className="filter" text={ option.name } isChecked={ option.isSelected } onClick={ option.onClick } />
                        )}
                    </div>
                )}
            </aside>
        );
    }
});