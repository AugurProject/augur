import React from 'react';
import {
  Breakdown,
} from 'modules/modal/common';
import {
  LinearPropertyLabelProps,
} from 'modules/common/labels';
import { PrimaryButton } from 'modules/common/buttons';
import Styles from 'modules/universe-cards/universe-card.styles.less';

interface UniverseCardProps {
  universeId: string;
  currentUniverseId: string;
  parentUniverseId: string | null;
  creationTimestamp: string;
  outcomeName: string;
  account: string;
  breakdown?: LinearPropertyLabelProps[];
  switchUniverse: Function;
  history: History;
}

export const UniverseCard = (
  {
    universeId,
    currentUniverseId,
    parentUniverseId,
    creationTimestamp,
    outcomeName,
    history,
    breakdown,
    switchUniverse,
  }: UniverseCardProps
) => {
  let primaryButtonText = '';
  let desiredUniverseId = null;
  if (universeId === currentUniverseId && parentUniverseId !== null) {
    primaryButtonText = 'Switch to this Universe\'s Parent Universe';
    desiredUniverseId = parentUniverseId;
  } else if (universeId !== currentUniverseId) {
    primaryButtonText = 'Switch to this Universe';
    desiredUniverseId = universeId;
  };
  return (
    <div className={Styles.UniverseCard}>
      {universeId === currentUniverseId &&
        <span>Current Universe</span>
      }
      <div>
        <h1>Universe</h1>
        <div>{outcomeName}</div>
      </div>
      <div>
        <h1>Date Created</h1>
        <div>{creationTimestamp}</div>
      </div>
      <Breakdown rows={breakdown} />
      {desiredUniverseId !== null &&
        <PrimaryButton
          text={primaryButtonText}
          action={() => switchUniverse(desiredUniverseId, history)}
        />
      }
    </div>
  );
};
