import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalMessage from "modules/modal/components/modal-message";
import isMetaMask from "modules/auth/helpers/is-meta-mask";

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({});

const mergeProps = (sP, dP, oP) => {
  const { expectedNetwork } = sP.modal;
  const description = [];
  if (isMetaMask()) {
    description.push(`MetaMask is connected to the wrong Ethereum network.`);
    description.push(
      `Please set the MetaMask network to: <strong>${expectedNetwork}</strong>.`
    );
  } else {
    description.push(
      `Your Ethereum node and Augur node are connected to different networks.`
    );
    description.push(
      `Please connect to a <strong>${expectedNetwork}</strong> Ethereum node.`
    );
  }

  return {
    title: "Network Mismatch",
    description
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalMessage)
);
