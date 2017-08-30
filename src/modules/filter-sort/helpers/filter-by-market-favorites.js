export default function filterByMarketFavorites(items) {
  if (items == null || !items.length) return null

  return items.reduce((p, item, i) => {
    if (item.isFavorite) return [...p, i]
    return p
  }, [])
}
