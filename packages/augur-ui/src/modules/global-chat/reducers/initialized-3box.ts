import { INITIALIZE_3BOX } from 'modules/global-chat/actions/initialize-3box';
import { BaseAction } from "modules/types";

const DEFAULT_STATE = {};

export default function(box = DEFAULT_STATE, { type, data }: BaseAction): any {
  switch (type) {
    case INITIALIZE_3BOX:
      return {
        ...box,
        ...data,
      };
    default:
      return box;
  }
}
