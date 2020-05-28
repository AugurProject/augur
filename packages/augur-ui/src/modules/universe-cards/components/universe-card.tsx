import React from 'react';
import { useHistory } from 'react-router';
import { Breakdown } from 'modules/modal/common';
import { PrimaryButton } from 'modules/common/buttons';
import Styles from 'modules/universe-cards/universe-card.styles.less';
import { switchUniverse } from 'modules/universe-cards/actions/switch-universe';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { Universe } from 'modules/types';
import { formatAttoRep, formatDai } from 'utils/format-number';

interface UniverseCardProps {
  universe: Universe;
}
const useBreakdown = (universe) => [
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
];

export const UniverseCard = ({ universe }: UniverseCardProps) => {
  const history = useHistory();
  const {
    universe: { id: currentUniverseId, parentUniverseId },
  } = useAppStatusStore();
  const breakdown = useBreakdown(universe);
  const {
    id: universeId,
    creationTimestamp: rawCreationTime,
    outcomeName,
  } = universe;
  const creationTimestamp = convertUnixToFormattedDate(rawCreationTime)
    .formattedLocalShortWithUtcOffset;
  let primaryButtonText = '';
  let desiredUniverseId = null;
  if (universeId === currentUniverseId && parentUniverseId !== null) {
    primaryButtonText = "Switch to this Universe's Parent Universe";
    desiredUniverseId = parentUniverseId;
  } else if (universeId !== currentUniverseId) {
    primaryButtonText = 'Switch to this Universe';
    desiredUniverseId = universeId;
  }
  return (
    <div className={Styles.UniverseCard}>
      {universeId === currentUniverseId && <span>Current Universe</span>}
      <div>
        <h1>Universe</h1>
        <div>{outcomeName}</div>
      </div>
      <div>
        <h1>Date Created</h1>
        <div>{creationTimestamp}</div>
      </div>
      <Breakdown rows={breakdown} />
      {desiredUniverseId !== null && (
        <PrimaryButton
          text={primaryButtonText}
          action={() => switchUniverse(desiredUniverseId, history)}
        />
      )}
    </div>
  );
};

export default UniverseCard;
