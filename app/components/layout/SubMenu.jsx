let React = require('react');

module.exports = React.createClass({
    render() {
        return (
            <div className="row submenu">
                <a className="collapsed" data-toggle="collapse" href="#collapseSubmenu"
                   aria-expanded="false"
                   aria-controls="collapseSubmenu">
                    <h2>Navigation</h2>
                </a>

                <div id="collapseSubmenu" className="col-xs-12 collapse" aria-expanded="false">
                    <ul className="list-group" role="tablist" id="tabpanel">
                        { this.props.children }
                    </ul>
                </div>
            </div>
        )
    }
});