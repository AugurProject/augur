import { connect } from "react-redux";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { withPageAnalytic } from 'services/analytics';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

const withPageAnalyticContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withPageAnalytic);

export default withPageAnalyticContainer;
