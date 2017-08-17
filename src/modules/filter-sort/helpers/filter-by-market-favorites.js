export default function filterByMarketFavorites(items) {
  // console.log('items -- ', items);
  if (items == null || !items.length) return null;

  return items.reduce((p, item, i) => {
    // console.log('item -- ', item);
    if (item.isFavorite) return [...p, i];
    return p;
  }, []);
}
