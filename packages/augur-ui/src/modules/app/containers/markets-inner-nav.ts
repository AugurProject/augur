import { connect } from 'react-redux';
import { compose } from 'redux';
import BaseInnerNavPure from 'modules/app/components/inner-nav/base-inner-nav-pure';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data))
});

const MarketsInnerNavContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BaseInnerNavPure);

export default MarketsInnerNavContainer;
