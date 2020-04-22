import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import * as constants from 'modules/common/constants';

import Row from 'modules/common/row';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { formatNumber } from 'utils/format-number';
import { convertUnixToFormattedDate } from 'utils/format-date';

const { COLUMN_TYPES } = constants;

const mapStateToProps = (state: AppState, ownProps) => {};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const { outcome } = oP;

  const columnProperties = [
    {
      key: 'outcomeName',
      columnType: COLUMN_TYPES.TEXT,
      text: outcome.outcome,
      keyId: outcome.outcome,
      showExtraNumber: !!outcome.betType,
      value: outcome.betType,
    },
    {
      key: 'wager',
      columnType: COLUMN_TYPES.VALUE,
      value: formatNumber(outcome && outcome.wager),
      keyId: 'outcome-wager-' + outcome.outcome,
    },
    {
      key: 'odds',
      columnType: COLUMN_TYPES.VALUE,
      value: formatNumber(outcome && outcome.odds),
      keyId: 'outcome-odds-' + outcome.outcome,
    },
    {
      key: 'toWin',
      columnType: COLUMN_TYPES.VALUE,
      value: formatNumber(outcome && outcome.toWin),
      keyId: 'outcome-toWin-' + outcome.outcome,
    },
    {
      key: 'betDate',
      columnType: COLUMN_TYPES.TEXT,
      text: convertUnixToFormattedDate(outcome && outcome.betDate).formattedLocalShortDate,
      keyId: 'outcome-betDate-' + outcome.outcome,
    },
    {
      key: 'button',
      columnType: COLUMN_TYPES.CANCEL_TEXT_BUTTON,
      action: async (e: Event) => {},
    },
  ];
  return {
    ...oP,
    ...sP,
    ...dP,
    rowProperties: outcome,
    columnProperties,
    styleOptions: {
      noToggle: true,
      myBetRow: true,
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Row)
);
