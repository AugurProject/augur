import { connect } from "react-redux";
import TransactionMeta from "modules/portfolio/components/transaction-meta/transaction-meta";

const mapStateToProps = state => ({
  networkId: state.connection.augurNodeNetworkId || "1" // default
});

const Transactions = connect(mapStateToProps)(TransactionMeta);

export default Transactions;
