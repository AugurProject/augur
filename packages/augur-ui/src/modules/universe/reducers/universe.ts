import { UPDATE_UNIVERSE } from 'modules/universe/actions/update-universe';
import { RESET_STATE, SWITCH_UNIVERSE } from 'modules/app/actions/reset-state';
import { Universe, BaseAction } from 'modules/types';

const DEFAULT_STATE: Universe = {
  children: null,
  id: null,
  creationTimestamp: 0,
  parentUniverseId: null,
  forkingInfo: null,
  outcomeName: '',
  usersRep: '0',
  totalRepSupply: '0',
  totalOpenInterest: '0',
  numberOfMarkets: 0,
  disputeWindow: {
    address: null,
    startTime: 0,
    endTime: 0,
    purchased: '0',
    fees: '0',
  },
};

export default function(
  universe: Universe = DEFAULT_STATE,
  { type, data }: BaseAction
): Universe {
  switch (type) {
    case UPDATE_UNIVERSE: {
      const { updatedUniverse } = data;
      return {
        ...universe,
        ...updatedUniverse,
      };
    }
    case SWITCH_UNIVERSE:
      delete universe.forkingInfo;
      delete universe.disputeWindow;
      return {
        ...universe,
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return universe;
  }
}
