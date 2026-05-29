import json

# Load data
with open("../data/remedies.json", "r", encoding="utf-8") as file:
    data = json.load(file)

user_input = input("Enter your symptoms: ").lower()

found = False

# Split user input into words
words = user_input.split()

for item in data:
    # Check condition
    if item["condition"] in user_input:
        print("\nCondition:", item["condition"])
        print("Remedies:")
        for remedy in item["remedies"]:
            print("-", remedy)
        found = True
        break

    # Check symptoms more flexibly
    for symptom in item["symptoms"]:
        for word in words:
            if word in symptom:
                print("\nCondition:", item["condition"])
                print("Remedies:")
                for remedy in item["remedies"]:
                    print("-", remedy)
                found = True
                break
        if found:
            break

if not found:
    print("\nNo match found. Please consult a doctor.")