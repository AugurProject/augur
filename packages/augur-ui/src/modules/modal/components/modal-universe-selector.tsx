import React from 'react';

import { DefaultButtonProps } from 'modules/common/buttons';
import {
  Title,
  Description,
  ButtonsRow,
} from 'modules/modal/common';
import { Universe } from 'modules/types';
import UniverseCard from 'modules/universe-cards/containers/universe-card';

import Styles from 'modules/modal/modal.styles.less';
import { UniverseDetails } from '@augurproject/sdk/src/state/getter/Universe';

interface ModalUniverseSelectorProps {
  title: string;
  description: string;
  universeDetails: UniverseDetails,
  buttons: DefaultButtonProps[];
  closeAction: Function;
}

export const ModalUniverseSelector = ({
  title,
  description,
  universeDetails,
  buttons,
  closeAction
}: ModalUniverseSelectorProps) => {
  return(
    <div className={Styles.ModalUniverseSelector}>
      <Title title={title} closeAction={closeAction} />
      <Description description={description} />
      <main>
        <div>
          <UniverseCard
            universe={universeDetails}
          />
        </div>
        <div>
        {universeDetails.children.map((childUniverse: UniverseDetails) => (
          <UniverseCard {...childUniverse} />
        ))}
        </div>
      </main>
      <ButtonsRow buttons={buttons} />
    </div>
  );
}
