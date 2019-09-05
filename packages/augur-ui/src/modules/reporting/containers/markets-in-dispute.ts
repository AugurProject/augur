import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketsInDispute from "modules/reporting/components/markets-in-dispute";
import { loadDisputeWindow } from "modules/auth/actions/load-dispute-window";

const mapStateToProps = state => ({
  isConnected: state.connection.isConnected,
  markets: state.marketInfos,
});

const mapDispatchToProps = dispatch => ({
  loadDisputeWindow: () => dispatch(loadDisputeWindow()),
});

const mergeProps = (sP, dP, oP) => {
  const sortByOptions = [
    {
      label: "Amount REP Staked",
      value: "repStaked",
      comp(marketA, marketB) {
        return marketB.repStaked - marketA.repStaked;
      }
    },
    {
      label: "Dispute Round",
      value: "disputeRound",
      comp(marketA, marketB) {
        return marketB.disputeRound - marketA.disputeRound;
      }
    }
  ];

  return {
    ...oP,
    ...sP,
    ...dP,
    sortByOptions
  };
};

const Reporting = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MarketsInDispute)
);

export default Reporting;
