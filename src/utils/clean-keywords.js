export function cleanKeywords(keywords) {
	return (keywords || '').replace(/\s+/g, ' ').trim();
}

export function cleanKeywordsArray(keywords) {
	const CleanKeywords = cleanKeywords(keywords).toLowerCase();
	return CleanKeywords ? CleanKeywords.split(' ').sort() : [];
}
