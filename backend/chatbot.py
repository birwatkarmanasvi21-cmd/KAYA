from sentence_transformers import SentenceTransformer
from utils import (
    load_remedies,
    detect_red_flags,
    detect_severity,
    predict_condition,
    format_console_response,
    get_followup_suggestions,
)


def main():
    print("Loading AI model...")
    model = SentenceTransformer("../model-output/final")
    remedies = load_remedies()

    print("Health AI Assistant is ready.")
    print("Type 'exit' to quit.\n")

    while True:
        query = input("You: ").strip()

        if query.lower() in {"exit", "quit"}:
            print("Bot: Take care. Stay well.")
            break

        if not query:
            print("Bot: Please describe your symptoms.")
            continue

        if detect_red_flags(query):
            print("\nBot: [WARNING] Your symptoms may require medical attention. Please consult a doctor immediately.\n")
            continue

        severity = detect_severity(query)
        result = predict_condition(model, query, remedies)

        print("\nBot:")
        print(format_console_response(result, severity))

        followups = get_followup_suggestions(result["matched_condition"])
        print("\nSuggested follow-ups:")
        for s in followups:
            print(f"- {s}")
        print()


if __name__ == "__main__":
    main()