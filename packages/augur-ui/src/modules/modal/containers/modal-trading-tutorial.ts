import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { closeModal } from 'modules/modal/actions/close-modal';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import makePath from "modules/routes/helpers/make-path";
import makeQuery from "modules/routes/helpers/make-query";
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';
import { MARKET } from 'modules/routes/constants/views';
import { TRADING_TUTORIAL } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  return {
    title: 'Learn how to place a trade',
    buttons: [
      {
        text: 'Learn',
        action: () => {
          oP.history.push({
            pathname: makePath(MARKET),
            search: makeQuery({
              [MARKET_ID_PARAM_NAME]: TRADING_TUTORIAL,
            }),
          });
          dP.closeModal();
        },
      },
      {
        text: 'Close',
        action: () => {
          dP.closeModal();
        },
      },
    ],
    description: ['Please learn'],
    closeAction: () => dP.closeModal(),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
