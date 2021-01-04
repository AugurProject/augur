import React from 'react';

import Styles from 'modules/modal/modal.styles.less';
import { Header } from './common';

const ModalInvalid = () => {
  return (
    <section className={Styles.ModalInvalid}>
      <Header title='invalid' />
    </section>
  );
};

export default ModalInvalid;
