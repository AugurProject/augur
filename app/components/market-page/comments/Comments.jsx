let React = require('react');

let _ = require("lodash");

let FluxMixin = require("fluxxor/lib/flux_mixin");
FluxMixin = FluxMixin(React);

let Comment = require("./Comment");
let CommentForm = require("./CommentForm");


let Comments = React.createClass({

    mixins: [FluxMixin],

    componentDidMount: function () {
        if (this.props.market && this.props.market.id) {
            this.getFlux().actions.market.loadComments(this.props.market);
        }
    },

    render: function () {
        let commentsCount = (this.props.market.comments != null) ? this.props.market.comments.length : 0;

        return (
            <div className="comments">
                <h4>{ commentsCount } Comments</h4>

                <div>
                    <CommentForm
                        toggleSignInModal={this.props.toggleSignInModal}
                        account={ this.props.account }
                        handle={ this.props.handle }
                        marketId={ this.props.market.id }
                        />

                    {_.map(this.props.market.comments, function (comment) {
                        return <Comment
                            key={ comment.ipfsHash || comment.time.toString() + comment.author }
                            comment={comment}/>;
                    })}
                </div>
            </div>
        );
    }
});

module.exports = Comments;