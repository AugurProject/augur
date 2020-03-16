import { connect } from 'react-redux';
import { MarketComments } from 'modules/market/components/common/comments/market-comments';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';

const DEFAULT_NUM_POSTS = 10;
const COLOR_SCHEME = 'dark'; // this might change depending on themes

const mapStateToProps = (state, ownProps) => ({
  numPosts: ownProps.numPosts || DEFAULT_NUM_POSTS,
  colorScheme: ownProps.colorScheme || COLOR_SCHEME,
  networkId: getNetworkId(),
  whichCommentPlugin: state.env.plugins?.comments,
});

const MarketCommentsContainer = connect(mapStateToProps)(MarketComments);

export default MarketCommentsContainer;
