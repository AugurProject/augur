import type { Getters } from '@augurproject/sdk';

export const UPDATE_STATS = "UPDATE_STATS";

export function updateCategoryStats(stats: Getters.Markets.CategoryStats) {
  return {
    type: UPDATE_STATS,
    data: stats,
  };
}
