export default function filterByTags(tags, items) {
  // NOTE -- tag filtering is case sensitive

  if (tags == null || !tags.length) return null

  return items.reduce((p, item, i) => {
    if (tags.every(filterTag =>
      item.tags.some((tag, tagIndex) =>
        tagIndex !== 0 && tag === filterTag))
    ) {
      return [...p, i]
    }

    return p
  }, [])
}
