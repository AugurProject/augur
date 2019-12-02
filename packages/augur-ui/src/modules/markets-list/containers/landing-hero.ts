import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_SIGNUP } from 'modules/common/constants';
import { LandingHero } from 'modules/markets-list/components/landing-hero';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  showSignup: () => dispatch(updateModal({ type: MODAL_SIGNUP })),
});

const LandingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LandingHero)
);

export default LandingContainer;
