import { connect } from 'react-redux';
import { MarketComments } from 'modules/market/components/common/comments/market-comments';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';

const DEFAULT_NUM_POSTS = 10;
const COLOR_SCHEME = 'dark'; // this might change depending on themes

const mapStateToProps = ({authStatus, env}, {numPosts, colorScheme}) => ({
  colorScheme: colorScheme || COLOR_SCHEME,
  networkId: getNetworkId(),
  numPosts: numPosts || DEFAULT_NUM_POSTS,
  whichCommentPlugin: env.plugins?.comments,
  isLogged: authStatus.isLogged,
});

const MarketCommentsContainer = connect(mapStateToProps)(MarketComments);

export default MarketCommentsContainer;
