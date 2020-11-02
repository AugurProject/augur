import React from 'react';

import { CloseButton } from 'modules/common/buttons';
import UniverseCard from 'modules/universe-cards/components/universe-card';

import Styles from 'modules/modal/modal.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';

export const ModalUniverseSelector = () => {
  const { universe: universeDetails, modal, actions: { closeModal } } = useAppStatusStore();

  return (
    <div className={Styles.ModalUniverseSelector}>
      <div>
        <CloseButton action={() => closeModal()} />
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
