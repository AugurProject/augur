import { connect } from 'react-redux';
import App from 'modules/app/components/app';

import { selectNotificationsAndSeenCount } from 'modules/notifications/selectors/notifications';
import { selectMarketsHeader } from 'modules/markets/selectors/markets-header';
import { selectTags } from 'modules/markets/selectors/tags';
import { selectCoreStats } from 'modules/account/selectors/core-stats';
import { selectTopics } from 'modules/topics/selectors/topics';
import links, { selectTopicLink } from 'modules/link/selectors/links';
import portfolio from 'modules/portfolio/selectors/portfolio';
import { updateIsMobile } from 'modules/app/actions/update-is-mobile';
import { updateHeaderHeight } from 'modules/app/actions/update-header-height';
import { updateFooterHeight } from 'modules/app/actions/update-footer-height';
import getChatMessages from 'modules/chat/selectors/chat-messages';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  url: state.url,
  activeView: state.activeView,
  loginAccount: state.loginAccount,
  marketsHeader: selectMarketsHeader(state),
  portfolio: portfolio(),
  links: links(),
  notifications: selectNotificationsAndSeenCount(state),
  keywords: selectTags(state),
  coreStats: selectCoreStats(state),
  isLogged: !!getValue(state, 'loginAccount.address'),
  isMobile: state.isMobile,
  headerHeight: state.headerHeight,
  footerHeight: state.footerHeight,
  chat: getChatMessages(),
  categories: selectTopics(state),
  selectedCategory: state.selectedTopic
});

const mapDispatchToProps = dispatch => ({
  updateIsMobile: isMobile => dispatch(updateIsMobile(isMobile)),
  updateHeaderHeight: headerHeight => dispatch(updateHeaderHeight(headerHeight)),
  updateFooterHeight: footerHeight => dispatch(updateFooterHeight(footerHeight)),
  selectCategory: topic => selectTopicLink(topic, dispatch).onClick()
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
