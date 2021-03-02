import React, {useEffect, useState} from 'react';
// import ModalAddLiquidity from './modal-add-liquidity';
import {useHistory} from 'react-router';
import Styles from './modal.styles.less';
import {useAppStatusStore} from '../stores/app-status';
import { Constants } from '@augurproject/augur-comps';
import ModalConnectWallet from './modal-connect-wallet';

function selectModal(type, modal) {
  switch (type) {
    // case MODAL_ADD_LIQUIDITY:
    //   return <ModalAddLiquidity {...modal} />;
    case Constants.MODAL_CONNECT_WALLET:
      return <ModalConnectWallet {...modal} />
    default:
      return <div />;
  }
}

const ESCAPE_KEYCODE = 27;

const ModalView = () => {
  const history = useHistory();
  const {
    modal,
    actions: { closeModal },
  } = useAppStatusStore();
  const [locationKeys, setLocationKeys] = useState([]);

  const handleKeyDown = e => {
    if (e.keyCode === ESCAPE_KEYCODE) {
      if (modal && modal.cb) {
        modal.cb();
      }
      closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return history.listen(location => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.key]);
      }

      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);

          closeModal();
        } else {
          setLocationKeys(keys => [location.key, ...keys]);

          closeModal();
        }
      }
    });
  }, [locationKeys]);

  const Modal = selectModal(
    modal.type,
    modal
  );

  return (
    <section className={Styles.ModalView}>
      <div>
        {Modal}
      </div>
    </section>
  );
};

export default ModalView;
