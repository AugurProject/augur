import { clamp } from "lodash/fp";
import {
  LOWER_FIXED_PRECISION_BOUND,
  UPPER_FIXED_PRECISION_BOUND
} from "modules/common-elements/constants";

export const precisionClampFunction = clamp(
  LOWER_FIXED_PRECISION_BOUND,
  UPPER_FIXED_PRECISION_BOUND
);
