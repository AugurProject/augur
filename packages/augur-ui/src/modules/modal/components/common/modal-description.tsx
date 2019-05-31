import React from "react";
import ReactHtmlParser from "react-html-parser";

import Styles from "modules/modal/components/common/common.styles.less";

interface ModalDescriptionProps {
  text: string;
}

const ModalDescription = ({ text }: ModalDescriptionProps) => (
  <p className={Styles.Description}>{ReactHtmlParser(text)}</p>
);

export default ModalDescription;
