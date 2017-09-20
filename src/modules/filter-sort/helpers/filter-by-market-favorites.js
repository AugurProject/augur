export function filterByMarketFavorites(items) { // NOTE -- intentionally excluded `default` for enforced function name comparison
  if (items == null || !items.length) return null

  return items.reduce((p, item, i) => {
    if (item.isFavorite) return [...p, i]
    return p
  }, [])
}
