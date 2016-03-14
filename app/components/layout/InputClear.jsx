let React = require('react');
let _ = require("lodash");
let classnames = require("classnames");

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            value: '',
            onChange: null,
            className: ''
        };
    },

    getInitialState: function() {
        return {
            searchString: this.props.value
        };
    },

    render() {
        return (
            <div className={ classnames('input-clear', this.props.className) }>
                <input type="search"
                       className="box"
                       placeholder="Search"
                       value={ this.state.searchString }
                       onChange={ this.handleOnChange } />

                <button className="fa fa-close clear"
                        onClick={ this.handleClear } />
            </div>
        );
    },

    handleOnChange: function (e) {
        this.setState({ searchString: e.target.value });
        this.debouncedOnChange();
    },

    debouncedOnChange: _.debounce(function (val) {
        this.props.onChange(this.state.searchString);
    }, 500),

    handleClear: function() {
        this.setState({ searchString: '' });
        this.props.onChange('');
    }
});
