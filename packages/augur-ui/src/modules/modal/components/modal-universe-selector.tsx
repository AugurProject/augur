import React from 'react';

import { CloseButton } from 'modules/common/buttons';
import { UniverseDetails } from '@augurproject/sdk/src/state/getter/Universe';
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
      <p>A few lines of copy explaining what Augur universes are.</p>
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
