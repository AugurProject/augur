export function CleanKeywords(keywords) {
	return (keywords || '').replace(/\s+/g, ' ').trim();
}

export function CleanKeywordsArray(keywords) {
    var cleanKeywords = CleanKeywords(keywords).toLowerCase();
	return cleanKeywords ? cleanKeywords.split(' ').sort() : [];
}