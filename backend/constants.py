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

MAX_AVATAR_BYTES = 5 * 1024 * 1024 # same as 5MB

ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}

PERSONALIZATION_THRESHOLD = 5

MAX_KEYWORDS = 10

NEWS_QUERY = "technology OR science OR innovation OR politics OR health OR environment OR education OR economy OR culture OR sports OR entertainment OR world"

PAGE_SIZE = 100

FEED_DEFAULT_LIMIT = 20

INTERACTION_WEIGHTS = {
	"like": 2.0,
	"dislike": -1.5,
	"view": 1.0,
}

RECOMMENDATION_ALPHA = 0.7
RECOMMENDATION_PROFILE_CAP = 500
RECOMMENDATION_KNN_NEIGHBORS = 10