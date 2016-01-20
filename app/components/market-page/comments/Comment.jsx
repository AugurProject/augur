let React = require('react');

let Identicon = require("../../../libs/identicon");
let moment = require("moment");

let Comment = React.createClass({
    // comment format:
    // ipfsHash: 'QmZGraGmtwejgHAWcLVfre86Q4Z3MfVBVFEw6Qm7L1PaKC'
    // author: '0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b'
    // time: number,// (but don't know what unit)
    // message: 'why hello!'
    // blockNumber: '0x95c6'

    render() {
        let identicon = 'data:image/png;base64,' + new Identicon(this.props.comment.author, 50).toString();

        return (
            <div className="comment">
                <div className="media">
                    <div className="media-left">
                        <div className="avatar media-object"
                             style={{ backgroundImage: 'url(' + identicon + ')' }}
                            ></div>
                    </div>
                    <div className="media-body">
                        <div className="comment-metaInfo">
                            { moment(this.props.comment.time * 1000).fromNow() } by { this.props.comment.author }
                        </div>
                        <p>
                            { this.props.comment.message }
                        </p>
                    </div>
                </div>
            </div>

        );
    }
});

module.exports = Comment;