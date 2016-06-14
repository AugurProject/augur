/*
 * Provides clickable wrapper (default is span) with pointer cursor.
 * 
 * Author: priecint
 */

import React from 'react';

export const Clickable = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func,
        component: React.PropTypes.any
    },

    getDefaultProps() {
        return {
            component: 'span'
        }
    },
    onClick() {
        if (typeof this.props.onClick === 'function') {
            this.props.onClick();
        }
    },

    render() {
        return (
            React.createElement(
                this.props.component,
                {
                    className: 'clickable',
                    onClick: this.onClick
                },
                this.props.children
            )
        );
    }
});