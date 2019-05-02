import { connect } from "react-redux";
import EtherscanLink from "modules/common/components/etherscan-link";

const mapStateToProps = state => {
  const networkId = state.connection.augurNodeNetworkId;
  const networkLink = {
    1: "https://etherscan.io/tx/",
    3: "https://ropsten.etherscan.io/tx/",
    4: "https://rinkeby.etherscan.io/tx/",
    19: "http://scan.thundercore.com/tx/",
    42: "https://kovan.etherscan.io/tx/"
  };

  return {
    baseUrl: networkLink[networkId]
  };
};

const etherscan = connect(mapStateToProps)(EtherscanLink);

export default etherscan;
