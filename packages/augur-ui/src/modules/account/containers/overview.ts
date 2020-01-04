import { connect } from 'react-redux';
import Overview from 'modules/account/components/overview';
import { updateTimeframeData } from 'modules/account/actions/update-timeframe-data';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { selectReportingBalances } from '../selectors/select-reporting-balances';
import { formatRep } from 'utils/format-number';

const mapStateToProps = (state: AppState) => {
  const {
    repTotalAmountStakedFormatted,
    repBalanceFormatted,
  } = selectReportingBalances(state);
  // TODO: make this less redundant
  return {
    repTotalAmountStakedFormatted: formatRep(
      repTotalAmountStakedFormatted.fullPrecision,
      { removeComma: true }
    ),
    repBalanceFormatted: formatRep(repBalanceFormatted.fullPrecision, {
      removeComma: true,
    }),
    currentAugurTimestamp: selectCurrentTimestampInSeconds(state),
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateTimeframeData: (options: any) => dispatch(updateTimeframeData(options)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
