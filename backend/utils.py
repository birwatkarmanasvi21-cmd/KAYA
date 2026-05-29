import json
import re
from sentence_transformers import util
from config import RED_FLAG_TERMS, SEVERITY_KEYWORDS, PHRASE_NORMALIZATION


def load_remedies():
    with open("../data/remedies.json", "r", encoding="utf-8") as f:
        return json.load(f)


def normalize_text(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)

    for phrase, normalized in PHRASE_NORMALIZATION.items():
        if phrase in text:
            return normalized

    return text


def detect_red_flags(text: str) -> bool:
    text = text.lower()
    return any(term in text for term in RED_FLAG_TERMS)


def detect_severity(text: str) -> str:
    text = text.lower()

    for keyword, level in SEVERITY_KEYWORDS.items():
        if keyword in text:
            return level

    return "medium"


def build_condition_embeddings(model, remedies):
    texts_to_embed = [
        f"{item['condition']}: " + " ".join(item["symptoms"])
        for item in remedies
    ]
    embeddings = model.encode(texts_to_embed, convert_to_tensor=True)
    conditions = [item["condition"] for item in remedies]
    return conditions, embeddings


def predict_condition(model, query: str, remedies):
    normalized_query = normalize_text(query)
    conditions, condition_embeddings = build_condition_embeddings(model, remedies)
    query_embedding = model.encode(normalized_query, convert_to_tensor=True)

    scores = util.cos_sim(query_embedding, condition_embeddings)
    best_idx = scores.argmax().item()
    confidence = float(scores[0][best_idx].item())

    return {
        "normalized_query": normalized_query,
        "matched_condition": conditions[best_idx],
        "confidence": confidence,
        "matched_item": remedies[best_idx],
    }


def get_followup_suggestions(condition: str):
    suggestions = {
        "headache": [
            "How long have you had this headache?",
            "Are you also feeling stressed or tired?"
        ],
        "cold": [
            "Do you also have sneezing or congestion?",
            "Are you feeling tired or feverish too?"
        ],
        "cough": [
            "Is it a dry cough or wet cough?",
            "Do you also have throat irritation?"
        ],
        "sore throat": [
            "Does it hurt while swallowing?",
            "Do you also have cough or fever?"
        ],
        "fever": [
            "Do you also have body ache or fatigue?",
            "How high does your temperature feel?"
        ],
    }
    return suggestions.get(condition, ["Would you like some more self-care tips?"])


def format_chat_response(result: dict, severity: str):
    item = result["matched_item"]
    confidence_pct = round(result["confidence"] * 100, 2)

    remedies_text = "\n".join([f"- {r}" for r in item["remedies"]])

    message = (
        f"It looks like you may have **{item['condition']}**.\n\n"
        f"Here are some gentle home remedies you can try:\n"
        f"{remedies_text}\n\n"
        f"**Confidence:** {confidence_pct}%\n"
        f"**Severity level detected:** {severity}\n\n"
        f"This is not medical advice. If symptoms worsen or persist, please consult a doctor."
    )

    return message


def format_console_response(result: dict, severity: str):
    item = result["matched_item"]
    confidence_pct = round(result["confidence"] * 100, 2)

    lines = [
        f"Predicted condition: {item['condition']}",
        f"Confidence: {confidence_pct}%",
        f"Severity: {severity}",
        f"Normalized input: {result['normalized_query']}",
        "Remedies:"
    ]

    for remedy in item["remedies"]:
        lines.append(f"- {remedy}")

    lines.append("\nDisclaimer: This is not medical advice.")
    return "\n".join(lines)