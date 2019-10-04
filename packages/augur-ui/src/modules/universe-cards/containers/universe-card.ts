import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'store';
import { UniverseCard } from 'modules/universe-cards/components/universe-card';
import { switchUniverse } from 'modules/universe-cards/actions/switch-universe';
import { formatDai, formatAttoRep } from 'utils/format-number';
import { convertUnixToFormattedDate } from 'utils/format-date';

const mapStateToProps = (state: AppState, ownProps) => {
  const universe = state.universe;
  return {
    universeId: universe.address,
    creationTimestamp: convertUnixToFormattedDate(universe.creationTimestamp).formattedLocalShortTime,
    outcomeName: universe.outcomeName,
    currentUniverse: state.universe.id,
    breakdown: [
      {
        label: 'Your REP',
        value: formatAttoRep(universe.usersRep).formatted,
      },
      {
        label: 'Total REP Supply',
        value: formatAttoRep(universe.totalRepSupply).formatted,
      },
      {
        label: 'Total Open Interest',
        value: formatDai(universe.totalOpenInterest).full,
      },
      {
        label: 'Number of Markets',
        value: universe.numberOfMarkets,
      },
    ],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    switchUniverse: (universeId: string) => dispatch(switchUniverse(universeId)),
  };
};

const mergeProps = (sP: any, dP: any, oP: any) => {
  return {
    ...oP,
    ...sP,
    ...dP,
    buttons: [
      {
        text: 'Switch to this Universe',
        action: () => {
          dP.switchUniverse(sP.universeId)
        },
      },
    ],
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(UniverseCard)
);
