import React from 'react';
import classnames from 'classnames';

import Form1 from './create-market-form-1';
import Form2 from './create-market-form-2';
import Form3 from './create-market-form-3';
import Form4 from './create-market-form-4';
import Form5 from './create-market-form-5';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        step: React.PropTypes.number
    },

    render: function() {
        var p = this.props,
        	form;

        switch (p.step) {
        	case 1:
        		form = <Form1 { ...p } />;
        		break;
        	case 2:
        		form = <Form2 { ...p } />;
        		break;
        	case 3:
        		form = <Form3 { ...p } />;
        		break;
        	case 4:
        		form = <Form4 { ...p } />;
        		break;
        	case 5:
        		form = <Form5 { ...p } />;
        		break;
        }

        return (
        	<section className={ p.className }>
        		{ form }
        	</section>
        );
    }
});