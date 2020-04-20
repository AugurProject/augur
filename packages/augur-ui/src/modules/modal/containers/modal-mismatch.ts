import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import isMetaMask from "modules/auth/helpers/is-meta-mask";
import { AppState } from "appStore";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = () => ({});

const mergeProps = (sP: AppState) => {
  const { expectedNetwork } = sP.modal;
  const description: Array<string> | undefined = [];
  if (isMetaMask()) {
    description.push(`MetaMask is connected to the wrong Ethereum network. Please set the MetaMask network to: ${expectedNetwork}.`);
  } else {
    description.push(
      `Your Ethereum node and Augur node are connected to different networks.`,
    );
    description.push(`Please connect to a ${expectedNetwork} Ethereum node.`);
  }

  return {
    title: "Network Mismatch",
    description,
    buttons: [],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
