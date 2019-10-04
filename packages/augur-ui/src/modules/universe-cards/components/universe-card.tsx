import React from 'react';
import {
  Breakdown,
  ButtonsRow,
} from 'modules/modal/common';
import { DefaultButtonProps } from 'modules/common/buttons';
import {
  LinearPropertyLabelProps,
} from 'modules/common/labels';

import Styles from 'modules/universe-cards/universe-card.styles.less';

interface UniverseCardProps {
  universeId: string;
  creationTimestamp: string;
  outcomeName: string;
  currentUniverse: string;
  buttons: DefaultButtonProps[];
  breakdown?: LinearPropertyLabelProps[];
}

export const UniverseCard = ({
  universeId,
  creationTimestamp,
  outcomeName,
  currentUniverse,
  breakdown,
  buttons
}: UniverseCardProps) => {

  return (
    <div className={Styles.UniverseCard}>
      <div>
        {universeId === currentUniverse &&
          <span>Current Universe</span>
        }
        <div>
          <h1>Universe</h1>
          <div className={Styles.outcomeName}>{outcomeName}</div>
        </div>
        <div>
          <h1>Date Created</h1>
          <div className={Styles.creationTimestamp}>{creationTimestamp}</div>
        </div>
        <Breakdown rows={breakdown} />
      </div>
      {universeId !== currentUniverse &&
        <ButtonsRow buttons={buttons} />
      }
    </div>
  );
};
