import React from 'react';

import { CloseButton } from 'modules/common/buttons';
import type { UniverseDetails } from '@augurproject/sdk';
import UniverseCard from 'modules/universe-cards/containers/universe-card';

import Styles from 'modules/modal/modal.styles.less';

interface ModalUniverseSelectorProps {
  universeDetails: UniverseDetails,
  closeAction: Function;
}

export const ModalUniverseSelector = ({
  universeDetails,
  closeAction
}: ModalUniverseSelectorProps) => {
  return(
    <div className={Styles.ModalUniverseSelector}>
      <div>
        <CloseButton action={() => closeAction()} />
        <h1>Augur Universe Picker</h1>
      </div>
      <p>A Universe in Augur is a collection of markets. Universes can have children and a parent.</p>
      <main>
        <UniverseCard
          universe={universeDetails}
        />
        <div>
          {universeDetails.children.map(childUniverse => (
            <UniverseCard key={childUniverse.id} universe={childUniverse} />
          ))}
        </div>
      </main>
    </div>
  );
}
