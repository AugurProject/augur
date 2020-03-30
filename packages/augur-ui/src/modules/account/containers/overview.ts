import { connect } from 'react-redux';
import Overview from 'modules/account/components/overview';
import { AppState } from 'appStore';
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
  };
};

export default connect(
  mapStateToProps
)(Overview);
