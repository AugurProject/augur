import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalUniverseSelector } from 'modules/modal/components/modal-universe-selector';
import { closeModal } from 'modules/modal/actions/close-modal';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => {
  const universe = state.universe;
  return {
    modal: state.modal,
    universeDetails: {
      address: universe.address,
      creationTimestamp: universe.creationTimestamp,
      outcomeName: universe.outcomeName,
      usersRep: universe.usersRep,
      totalRepSupply: universe.totalRepSupply,
      totalOpenInterest: universe.totalOpenInterest,
      numberOfMarkets: universe.numberOfMarkets,
      // children: universe.children,
      children: [
        {
          address: '0x161C723Cac007e4283CEe4ba11B15277e46eeC53',
          children: [],
          creationTimestamp: 1570216208,
          outcomeName: 'No',
          usersRep: '1000000000000000000000001',
          numberOfMarkets: 20,
          totalOpenInterest: "0",
          totalRepSupply: "1000006993611653645833341",
        },
        {
          address: '0x161C723Cac007e4283CEe4ba11B15277e46eeC53',
          children: [],
          creationTimestamp: 1570216208,
          outcomeName: 'Yes',
          usersRep: '1000000000000000000000001',
          numberOfMarkets: 20,
          totalOpenInterest: "0",
          totalRepSupply: "1000006993611653645833341",
        },
    },
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  return {
    ...sP,
    ...dP,
    ...oP,
    title: 'Augur Universe Picker',
    description: ['A few lines of copy explaining what Augur universes are.'],
    closeModal: () => dP.closeModal(),
    buttons: [
      {
        text: 'Close',
        action: () => dP.closeModal(),
      },
    ],
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(ModalUniverseSelector)
);
