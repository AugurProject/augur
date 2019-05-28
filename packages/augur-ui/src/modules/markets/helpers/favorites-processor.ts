// helper to check if localAccountStorage is the new style of favorites or the old.
export const isNewFavoritesStyle = storedFavorites => {
  const networkKeys = Object.keys(storedFavorites);
  return networkKeys.reduce((acc, key) => {
    let newAcc = acc;
    if (typeof storedFavorites[key] !== "object") newAcc = false;
    return newAcc;
  }, true);
};

export const processFavorites = (
  stateFavsIn,
  storedFavsIn,
  networkId,
  universeId
) => {
  // default it this way just incase there is weird data
  const stateFavs = stateFavsIn || {};
  const storedFavs = storedFavsIn || {};
  const storedPopulated = Object.keys(storedFavs).length !== 0;
  const storedProperly = isNewFavoritesStyle(storedFavs);
  const storedNetwork = storedFavs[networkId];
  const storedUniverseFavorites =
    storedNetwork && storedFavs[networkId][universeId];
  // we have stored favorites
  if (storedPopulated) {
    if (storedProperly) {
      // stored favorites have the new style
      if (storedNetwork && storedUniverseFavorites) {
        // we have a network and universe match, make sure to bring them over
        return {
          ...storedFavs,
          [networkId]: {
            [universeId]: {
              ...storedUniverseFavorites,
              ...stateFavs
            }
          }
        };
      }
      // we don't have a network and universe match, must create one
      return {
        ...storedFavs,
        [networkId]: {
          [universeId]: stateFavs
        }
      };
    }
    // old stored favorites, convert to new style
    return {
      [networkId]: { [universeId]: storedFavs }
    };
  }
  // storedFavotires don't exist, lets just set them.
  return {
    [networkId]: { [universeId]: stateFavs }
  };
};
