import re
from collections import Counter
from backend.config import settings
from backend.constants import STOP_WORDS


def extract_keywords(text: str, max_keywords: int) -> list[str]:
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
	keywords = extract_keywords(combined_text, settings.MAX_KEYWORDS)
	return ", ".join(keywords)