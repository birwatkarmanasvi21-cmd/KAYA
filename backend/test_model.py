import json
from sentence_transformers import SentenceTransformer, util


def main():
    model = SentenceTransformer("../model-output/final")

    with open("../data/remedies.json", "r", encoding="utf-8") as f:
        remedies = json.load(f)

    conditions = [item["condition"] for item in remedies]
    condition_embeddings = model.encode(conditions, convert_to_tensor=True)

    query = input("Enter symptoms: ")
    query_embedding = model.encode(query, convert_to_tensor=True)

    scores = util.cos_sim(query_embedding, condition_embeddings)
    best_idx = scores.argmax().item()

    match = remedies[best_idx]

    print("\nPredicted condition:", match["condition"])
    print("Remedies:")
    for remedy in match["remedies"]:
        print("-", remedy)


if __name__ == "__main__":
    main()