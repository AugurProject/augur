import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { SocialMediaButtons } from '../components/common/social-media-buttons';
import { track } from 'services/analytics/helpers';

const mapStateToProps = (state: AppState) => ({
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  track: (eventName, payload) => dispatch(track(eventName, payload)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SocialMediaButtons)
);
