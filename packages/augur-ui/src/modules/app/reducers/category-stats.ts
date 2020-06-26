import { UPDATE_STATS } from "modules/app/actions/update-stats";
import { RESET_STATE } from "modules/app/actions/reset-state";
import type { Getters } from "@augurproject/sdk";


export default function(
  stats: Getters.Markets.CategoryStats = {},
  { type, data },
): Getters.Markets.CategoryStats {
  switch (type) {
    case UPDATE_STATS: {
      return data;
    }
    case RESET_STATE:
      return {};
    default:
      return stats;
  }
}
