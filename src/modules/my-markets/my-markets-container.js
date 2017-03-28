import { connect } from 'react-redux';

import MyMarkets from 'modules/my-markets/components/my-markets';

import getMyMarkets from 'modules/my-markets/selectors/my-markets';

const mapStateToProps = () => ({
  myMarkets: getMyMarkets()
});

const MyMarketsContainer = connect(mapStateToProps)(MyMarkets);

export default MyMarketsContainer;
