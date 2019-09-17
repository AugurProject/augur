import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MarketComments } from 'modules/market/components/common/comments/market-comments';

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => ({
});

const MarketCommentsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketComments)
);

export default MarketCommentsContainer;
