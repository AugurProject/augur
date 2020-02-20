import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { formatAttoRep } from 'utils/format-number';
import Stats from 'modules/account/components/stats';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { selectCurrentTimestampInSeconds } from 'appStore/select-state';
import { updatePlatformTimeframeData } from 'modules/account/actions/update-platform-timeframe-data';

const mapStateToProps = (state: AppState) => ({
  timeframeData: state.universe.timeframeData,
  currentAugurTimestamp: selectCurrentTimestampInSeconds(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateTimeframeData: (options: any) =>
    dispatch(updatePlatformTimeframeData(options)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const {
    activeUsers,
    marketsCreated,
    numberOfTrades,
    disputedMarkets,
    volume,
    amountStaked,
  } = sP.timeframeData;
  const properties: any = [
    {
      key: 0,
      label: 'Active Users',
      value: activeUsers,
      options: {
        decimals: 0,
        decimalsRounded: 0,
      },
    },
    {
      key: 1,
      label: 'Markets Created',
      value: marketsCreated,
    },
    {
      key: 2,
      label: 'Trades',
      value: numberOfTrades,
      options: {
        decimals: 0,
        decimalsRounded: 0,
      },
    },
    {
      key: 3,
      label: 'Markets in dispute',
      value: disputedMarkets,
    },
    {
      key: 4,
      label: 'Volume',
      value: volume,
      options: {
        useFull: true,
        removeComma: true,
        denomination: v => `$${v}`,
      },
      useFull: true,
    },
    {
      key: 5,
      label: 'REP in dispute',
      value: formatAttoRep(amountStaked, {
        decimals: 4,
      }).fullPrecision,
    },
  ];

  return {
    ...oP,
    ...sP,
    ...dP,
    properties,
  };
};

const PlatformtOverviewStatsContainer: any = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Stats)
);

export default PlatformtOverviewStatsContainer;
