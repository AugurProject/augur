import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ModalNetworkConnect from 'modules/modal/components/modal-network-connect';

import { closeModal } from 'modules/modal/actions/close-modal';
import { isWeb3Transport } from 'modules/contracts/actions/contractCalls';
import { SDKConfiguration } from '@augurproject/artifacts';
import { AppStatus } from 'modules/app/store/app-status';

interface StateProps {
  modal: {
    type: string;
    config: SDKConfiguration;
  };
  isConnectedThroughWeb3: boolean;
}

const mapStateToProps = (state: StateProps) => ({
  modal: AppStatus.get().modal,
  isConnectedThroughWeb3: isWeb3Transport(),
});

const mapDispatchToProps = (dispatch) => ({
  submitForm: (e: Event) => e.preventDefault(),
  closeModal: () => dispatch(closeModal()),
});
// to make sure we override the generic submitForm with the passed submitForm from a disconnection Modal we need to merge props...
const mergedProps = (sP, dP, oP) => ({ ...sP, ...dP, ...oP });

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergedProps,
  )(ModalNetworkConnect),
) as any;
