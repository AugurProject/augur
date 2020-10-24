import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "appStore";
import Stats from "modules/account/components/stats";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { selectCurrentTimestampInSeconds } from 'appStore/select-state';
import { updateTimeframeData } from 'modules/account/actions/update-timeframe-data';
import { WALLET_STATUS_VALUES } from "modules/common/constants";

const mapStateToProps = (state: AppState) => ({
  timeframeData: state.loginAccount.timeframeData,
  currentAugurTimestamp: selectCurrentTimestampInSeconds(state),
  tradingAccountActivated: state.appStatus.walletStatus === WALLET_STATUS_VALUES.CREATED
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateTimeframeData: (options: any) => dispatch(updateTimeframeData(options)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const {
    positions,
    numberOfTrades,
    marketsTraded,
    marketsCreated,
    successfulDisputes,
    redeemedPositions,
  } = sP.timeframeData;

  const properties = [
    {
      key: 0,
      label: "Positions",
      value: positions,
      options: {
        decimals: 0,
        decimalsRounded: 0,
      },
    },
    {
      key: 1,
      label: "Number of Trades",
      value: numberOfTrades,
      options: {
        decimals: 0,
        decimalsRounded: 0,
      },
    },
    {
      key: 2,
      label: "Markets Traded",
      value: marketsTraded,
      options: {
        decimals: 0,
        decimalsRounded: 0,
      },
    },
    {
      key: 3,
      label: "Markets Created",
      value: marketsCreated,
      options: {
        decimals: 0,
        decimalsRounded: 0,
      },
    },
    {
      key: 4,
      label: "Successful Disputes",
      value: successfulDisputes,
      options: {
        decimals: 0,
        decimalsRounded: 0,
      },
    },
    {
      key: 5,
      label: "Redeemed Positions",
      value: redeemedPositions,
      options: {
        decimals: 0,
        decimalsRounded: 0,
      },
    },
  ];

  return {
    ...oP,
    ...sP,
    ...dP,
    properties,
  };
};

const StatsContainer: any = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Stats),
);

export default StatsContainer;
