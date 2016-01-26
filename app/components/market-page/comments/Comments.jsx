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
                <h4>
                    <span className="hidden-xs">
                        Comments
                    </span>
                    <a className="visible-xs-inline-block collapsibleTitle collapsed" data-toggle="collapse"
                       href="#commentsCollapse" aria-expanded="true" aria-controls="commentsCollapse">
                        Comments
                    </a>
                </h4>

                <div id="commentsCollapse" className="collapse collapsedOnMobile">
                    <p>{ commentsCount } comments</p>

                    <div>
                        <CommentForm
                            toggleSignInModal={this.props.toggleSignInModal}
                            account={ this.props.account }
                            handle={ this.props.handle }
                            marketId={ this.props.market.id }
                            />

                        {_.map(this.props.market.comments, function (comment) {
                            return <Comment
                                key={ comment.ipfsHash + comment.time.toString() + comment.author }
                                comment={comment}/>;
                        })}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Comments;