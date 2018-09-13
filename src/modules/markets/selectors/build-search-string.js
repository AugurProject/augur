export const buildSearchString = (keywords, tags) => {
  const MIN_KEYWORDS_LENGTH = 1;

  let keywordSearch =
    keywords && keywords.length > MIN_KEYWORDS_LENGTH ? keywords : undefined;
  if (
    keywordSearch &&
    (!keywordSearch.endsWith(" ") && !keywordSearch.endsWith('"'))
  )
    keywordSearch += "*";
  const terms = [];
  [...tags, keywordSearch].forEach(i => {
    if (i) terms.push(i);
  });

  const search =
    terms && terms.length > 1 ? terms.join(" OR ").trim(" OR ") : terms[0];

  return search;
};
