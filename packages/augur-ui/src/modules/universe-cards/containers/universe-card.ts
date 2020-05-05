import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { UniverseCard } from 'modules/universe-cards/components/universe-card';
import { switchUniverse } from 'modules/universe-cards/actions/switch-universe';
import { formatDai, formatAttoRep } from 'utils/format-number';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState, ownProps) => {
  const universe = ownProps.universe;
  const {
    loginAccount: { address: account },
    universe: { id, parentUniverseId },
  } = AppStatus.get();
  return {
    universeId: universe.id,
    currentUniverseId: id,
    parentUniverseId,
    creationTimestamp: convertUnixToFormattedDate(universe.creationTimestamp)
      .formattedLocalShortWithUtcOffset,
    outcomeName: universe.outcomeName,
    account,
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

const mapDispatchToProps = dispatch => ({
  switchUniverse: (universeId: string, history: History) =>
    dispatch(switchUniverse(universeId, history)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UniverseCard)
);
