import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Scalar } from 'modules/modal/scalar';
import { closeModal } from 'modules/modal/actions/close-modal';
import { SCALAR_MODAL_SEEN } from 'modules/common/constants';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeAction: (checked: boolean) => {
    const localStorageRef =
      typeof window !== 'undefined' && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.setItem(SCALAR_MODAL_SEEN, String(checked));
    }
    dispatch(closeModal());
  },
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...sP,
    ...dP,
    ...oP
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Scalar)
);
