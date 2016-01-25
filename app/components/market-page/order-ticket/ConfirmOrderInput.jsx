let React = require('react');

let Formsy = require('formsy-react');

let ConfirmOrderInput = React.createClass({
    mixins: [Formsy.Mixin],

    render() {
        return (
            <input
                type="checkbox"
                name={this.props.name}
                onChange={this.props.onChange}
                value={this.getValue()}
                checked={this.getValue() ? 'checked' : null}
                />
        );
    }
});

module.exports = ConfirmOrderInput;