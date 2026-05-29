RED_FLAG_TERMS = [
    "chest pain",
    "difficulty breathing",
    "trouble breathing",
    "blood in vomit",
    "vomiting blood",
    "unconscious",
    "seizure",
    "fainted",
    "very high fever",
    "severe dehydration",
    "breathing issue",
    "can't breathe",
    "cannot breathe",
]

SEVERITY_KEYWORDS = {
    "severe": "high",
    "very severe": "high",
    "intense": "high",
    "extreme": "high",
    "mild": "low",
    "slight": "low",
    "little": "low",
    "moderate": "medium",
}

# Hinglish + basic Marathi normalization map
PHRASE_NORMALIZATION = {
    "sir dard": "headache",
    "sar dard": "headache",
    "mere sir mein dard hai": "headache",
    "dok dukhta": "headache",
    "dok dukhtay": "headache",
    "majha dok dukhta": "headache",

    "khokla": "cough",
    "mala khokla aahe": "cough",
    "khup khokla yetoy": "cough",
    "cough ho raha hai": "cough",

    "sardi": "cold",
    "mala sardi aahe": "cold",
    "naak vahtey": "cold",
    "naak beh raha hai": "cold",
    "jukam": "cold",
    "zukam": "cold",

    "ghasa dukhtoy": "sore throat",
    "ghasa dukhta": "sore throat",
    "gala dukh raha hai": "sore throat",
    "gala kharab hai": "sore throat",

    "bukhar": "fever",
    "tap aala": "fever",
    "mala tap aahe": "fever",
    "fever jaisa lag raha hai": "fever",

    "pet dukhta": "indigestion",
    "pet kharab hai": "indigestion",
    "gas ho rahi hai": "indigestion",
    "phugla pet": "indigestion",

    "jalan ho rahi hai": "acidity",
    "chhati mein jalan": "acidity",

    "daat dukhtoy": "toothache",
    "daat dukhta": "toothache",
    "dant dukh raha hai": "toothache",

    "pot saf hot nahi": "constipation",
    "shauch nahi ho raha": "constipation",

    "julaab": "diarrhea",
    "loose motion ho raha hai": "diarrhea",

    "ulti jaisi ho rahi hai": "vomiting",
    "ulti ho rahi hai": "vomiting",

    "kaan dukhtoy": "ear pain",
    "kaan dukhta": "ear pain",

    "dole jalat aahet": "eye irritation",
    "ankh jal rahi hai": "eye irritation",

    "sandhe dukhtat": "joint pain",
    "joint dukh raha hai": "joint pain",

    "path dukhtey": "back pain",
    "path dukhta": "back pain",
    "back dukh raha hai": "back pain",

    "baal gir rahe hain": "hair fall",
    "kes galtat": "hair fall",

    "konda": "dandruff",
    "dandruff zala aahe": "dandruff",

    "twacha la khaj yete": "skin rash",
    "khaj aahe": "skin rash",

    "tension aahe": "stress",
    "bahut stress hai": "stress",

    "neend nahi aa rahi": "insomnia",
    "jhop yet nahi": "insomnia",
}