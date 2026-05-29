# KAYA - Health AI Assistant 
KAYA is a full-stack, AI-powered health assistant designed to analyze user symptoms and provide gentle, personalized home remedies. It uses a Natural Language Processing (NLP) model to intelligently map symptoms to conditions while filtering out remedies that conflict with a user's specific allergies.

> **Disclaimer:** KAYA is for informational purposes only and does not provide professional medical advice. Always consult a doctor for serious or persistent symptoms.

## Features

- **Symptom Analysis:** Uses a fine-tuned `SentenceTransformer` embedding model to accurately interpret symptoms (including mixed English/Hindi/Marathi phrases).
- **Allergy-Aware:** Cross-references user allergies to filter out unsafe remedy suggestions dynamically.
- **Red Flag Detection:** Automatically detects critical symptoms (e.g., severe chest pain) and triggers emergency warnings.
- **Full-Stack Architecture:** Built with a beautiful, responsive Next.js frontend and a fast, robust Python/FastAPI backend.

##  Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, TypeScript
- **Backend:** Python, FastAPI, Uvicorn
- **AI & NLP:** SentenceTransformers, PyTorch
- **Database:** PostgreSQL (Neon) & SQLAlchemy

## Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Start the Frontend And the Backend
Open a terminal in the root directory and run:
```bash
# Install dependencies (if you haven't already)
npm install

# Start the Next.js development server
npm run dev
# Activate the virtual environment (Windows)
.venv\Scripts\activate

# Navigate to the backend folder
cd backend

# Install python dependencies (if needed)
pip install -r requirements.txt

# Start the FastAPI server
uvicorn api:app --reload

