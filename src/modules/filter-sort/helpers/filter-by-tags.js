export default function filterByTags(tags, items) {
  // NOTE -- tag filtering is case sensitive

  if (tags == null || !tags.length) return null

  const filteredItems = items.reduce((p, item, i) => {
    if (tags.every(filterTag => item.tags.some(tag => tag.indexOf(filterTag) !== -1))) return [...p, i]

    return p
  }, [])

  return filteredItems
}
