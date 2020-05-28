import { compose } from 'redux';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import App from 'modules/app/components/app';
import { initAugur } from 'modules/app/actions/init-augur';
import { RewriteUrlParams } from 'modules/app/hocs/rewrite-url-params';
import { windowRef } from 'utils/window-ref';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
  const { updateMarketsList } = AppStatus.actions;
  return {
    initAugur: (history, overrides, cb) =>
      dispatch(initAugur(history, overrides, cb)),
    updateSelectedCategories: category =>
      updateMarketsList({
        selectedCategories: category || [],
        selectedCategory: category.length
          ? category[category.length - 1]
          : null,
      }),
  };
};
const AppContainer = compose(
  withRouter,
  RewriteUrlParams(windowRef),
  connect(mapStateToProps, mapDispatchToProps)
)(App);

export default AppContainer;
