export const buildSearchString = (keywords, tags) => {
  const MIN_KEYWORDS_LENGTH = 1;
  const propertyTranslation = [
    { find: "title:", replace: "shortDescription:" },
    { find: "details:", replace: "longDescription:" }
  ];

  const keywordSearch =
    keywords && keywords.length > MIN_KEYWORDS_LENGTH ? keywords : undefined;

  const terms = [];
  tags.forEach(i => {
    if (i) terms.push(`tags: ${i}`);
  });

  [keywordSearch].forEach(i => {
    if (i) terms.push(i);
  });

  const search =
    terms && terms.length > 1 ? terms.join(" OR ").trim(" OR ") : terms[0];

  if (!search) return;

  return propertyTranslation.reduce(
    (p, property) => p.replace(property.find, property.replace, search),
    search
  );
};
