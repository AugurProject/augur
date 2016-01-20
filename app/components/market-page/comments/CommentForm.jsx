let React = require('react');

let FluxMixin = require("fluxxor/lib/flux_mixin");
FluxMixin = FluxMixin(React);

let Identicon = require("../../../libs/identicon");

let ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
let Button = require('react-bootstrap/lib/Button');

let CommentForm = React.createClass({
    mixins: [FluxMixin],

    submitComment(event) {
        // todo: display processing and error states
        event.preventDefault();
        let element = document.getElementById("comment-text");
        let commentText = element.value;
        element.value = "";
        this.getFlux().actions.market.addComment(commentText, this.props.marketId, {
            address: this.props.account,
            handle: this.props.handle
        });
    },

    render() {
        if (this.props.account == null) {
            return (
                <div>
                    <button className="btn btn-link" onClick={this.props.toggleSignInModal}>
                        Sign in to comment
                    </button>
                </div>
            );
        } else {
            let icon = 'data:image/png;base64,' + new Identicon(this.props.account, 50).toString();
            return (
                <form className="commentForm" onSubmit={this.submitComment}>
                    <div className="media">
                        <div className="media-left">
                            <div className="avatar media-object"
                                style={{backgroundImage: 'url(' + icon + ')'}}
                                ></div>
                        </div>
                        <div className="media-body">
                            <input
                                type="textarea"
                                className="form-control"
                                id="comment-text"
                                placeholder="Enter comments here"/>

                            <div className="pull-right">
                                <Button
                                    style={{marginTop: 4}}
                                    type="submit"
                                    bsStyle="default"
                                    bsSize="xsmall"
                                    onClick={this.submitComment}>
                                    Babble
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            );
        }
    }
});

module.exports = CommentForm;