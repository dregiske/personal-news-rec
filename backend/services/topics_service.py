'''
Topic inference service — derives topics from article text using keyword matching.

NewsAPI does not provide a topic/category field at the article level, so topics
are inferred by scanning the title, description, and keywords against a curated
keyword map. Matched topics are stored as a comma-separated string.
'''

TOPIC_KEYWORDS: dict[str, list[str]] = {
	"technology": [
		"tech", "software", "ai", "artificial intelligence", "computer", "digital",
		"startup", "app", "cyber", "robot", "machine learning", "data", "internet",
		"cloud", "semiconductor", "chip", "smartphone", "algorithm", "coding", "developer",
	],
	"politics": [
		"election", "government", "president", "congress", "senate", "democrat",
		"republican", "political", "vote", "policy", "legislation", "white house",
		"parliament", "minister", "party", "ballot", "campaign", "diplomat", "treaty",
	],
	"business": [
		"economy", "stock", "market", "trade", "company", "corporate", "finance",
		"bank", "investment", "earnings", "revenue", "gdp", "inflation", "recession",
		"merger", "acquisition", "ipo", "startup", "entrepreneur", "profit", "shares",
	],
	"health": [
		"health", "medical", "disease", "hospital", "doctor", "vaccine", "drug",
		"treatment", "cancer", "covid", "mental health", "fitness", "wellness",
		"pandemic", "surgery", "diagnosis", "pharmacy", "nutrition", "obesity",
	],
	"sports": [
		"sport", "football", "basketball", "baseball", "soccer", "tennis", "olympic",
		"nfl", "nba", "championship", "team", "player", "game", "match", "tournament",
		"athlete", "coach", "league", "stadium", "transfer", "cricket", "golf",
	],
	"entertainment": [
		"movie", "film", "music", "celebrity", "award", "oscar", "grammy", "album",
		"actor", "singer", "entertainment", "hollywood", "tv", "streaming", "netflix",
		"concert", "festival", "box office", "director", "series", "podcast",
	],
	"science": [
		"science", "research", "study", "discovery", "space", "nasa", "climate",
		"environment", "species", "planet", "biology", "physics", "chemistry",
		"experiment", "genome", "fossil", "telescope", "quantum", "ocean", "atmosphere",
	],
	"world": [
		"international", "global", "war", "conflict", "ukraine", "china", "russia",
		"europe", "africa", "asia", "united nations", "foreign", "sanctions", "nato",
		"refugee", "humanitarian", "embassy", "treaty", "border", "immigration",
	],
}


def infer_topics(title: str, description: str | None, keywords: str | None) -> str | None:
	'''
	Infers comma-separated topics from article text fields.
	Returns None if no topics match.
	'''
	text = " ".join(filter(None, [title, description, keywords])).lower()
	matched = [
		topic
		for topic, signals in TOPIC_KEYWORDS.items()
		if any(signal in text for signal in signals)
	]
	return ",".join(matched) if matched else None
