import React from "react";
import PropTypes from "prop-types";

import Styles from "./modal-edit-connection.styles.less";

const ModalEditConnection = p => (
  <section className={Styles.ModalEditConnection}>
    <div>
    	Connection Name
    </div>
    <div>
        <input />
    </div>
    <div>
    	HTTP Endpoint
    </div>
    <div>
    	<input placeholder="http(s)://" />
    </div>
    <div>
    	Websocket Endpoint
    </div>
    <div>
        <input placeholder="ws://"/>
    </div>
    <div>
    	<div>Cancel</div>
    	<div>Save Connection</div>
    </div>
  </section>
);

ModalEditConnection.propTypes = {
  closeModal: PropTypes.func.isRequired,
  connectionId: PropTypes.string,
};

export default ModalEditConnection;
