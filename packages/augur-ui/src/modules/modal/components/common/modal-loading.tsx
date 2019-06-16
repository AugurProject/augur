import React from "react";
import { PulseLoader } from "react-spinners";

import Styles from "modules/modal/components/common/common.styles.less";

interface ModalLoadingProps {
  color?: string;
  size?: number;
  sizeUnit?: string;
  loading?: boolean;
}

const ModalLoading = ({ color = "#fff", size = 8, sizeUnit = "px", loading = true }: ModalLoadingProps) => (
  <div className={Styles.Loading}>
    <PulseLoader
      color={color}
      size={size}
      sizeUnit={sizeUnit}
      loading={loading}
    />
  </div>
);

export default ModalLoading;
