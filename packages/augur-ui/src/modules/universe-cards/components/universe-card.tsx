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
  creationTimestamp: string;
  outcomeName: string;
  currentUniverse: string;
  breakdown?: LinearPropertyLabelProps[];
  switchUniverse: Function;
}

export const UniverseCard = (
  {
    universeId,
    creationTimestamp,
    outcomeName,
    currentUniverse,
    breakdown,
    switchUniverse,
  }: UniverseCardProps
) => {
  let primaryButtonText = 'Switch to this Universe';
  if (universeId === currentUniverse) {
    primaryButtonText = 'Switch to this Universe\'s Parent Universe';
  }
  return (
    <div className={Styles.UniverseCard}>
      {universeId === currentUniverse &&
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
      <PrimaryButton
        text='Switch to this Universe'
        action={(universeId) => {
          switchUniverse(universeId)
        }}
      />
    </div>
  );
};
