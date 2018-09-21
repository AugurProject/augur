import React from "react";

import Styles from "modules/modal/components/modal-trezor/modal-trezor.styles";

const ModalTrezor = p => (
  <section className={Styles.ModalTrezor}>
    <h1>Trezor Information</h1>
    {p.info && <span>{p.info}</span>}
  </section>
);

export default ModalTrezor;
