'''
Keyword extraction service
'''

import re
from collections import Counter

STOP_WORDS = {
	"a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
	"any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
	"below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
	"did", "didn't", "does", "doesn't", "doing", "don't", "down", "during", "each",
	"few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't",
	"having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
	"him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if",
	"in", "into", "is", "isn't", "it", "it's", "its", "itself", "just", "ll", "ma", "me",
	"mightn't", "more", "most", "mustn't", "my", "myself", "needn't", "no", "nor", "not",
	"now", "of", "off", "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out",
	"over", "own", "re", "s", "same", "shan't", "she", "she'd", "she'll", "she's", "should",
	"shouldn't", "so", "some", "such", "t", "than", "that", "that's", "the", "their", "theirs",
	"them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've",
	"this", "those", "through", "to", "too", "under", "until", "up", "ve", "very", "was", "wasn't",
}


def extract_keywords(text: str, max_keywords: int = 10) -> list[str]:
	'''
	Extracts keywords from the given text by removing 
	stop words and selecting the most common words.
	'''
	if not text:
		return []
	
	tokens = re.findall(r"[a-zA-Z]+", text.lower())

	filtered = [
		t for t in tokens
		if t not in STOP_WORDS and len(t) > 2
	]

	counts = Counter(filtered)
	common = counts.most_common(max_keywords)
	return [word for word, _ in common]


def build_article_keywords(article) -> str:
	'''
	Builds a keyword string for the given article by
	extracting keywords from its title and content.
	'''
	title = article.get("title") or ""
	content = article.get("content") or ""

	text_parts = [title]

	if content:
		text_parts.append(content)

	combined_text = " ".join(text_parts)
	keywords = extract_keywords(combined_text, max_keywords=10)
	return ", ".join(keywords)