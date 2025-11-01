# LinkedIn Post Optimizer (Gemini AI Edition)

An AI-powered tool to help users generate and revise engaging, effective LinkedIn posts. This application uses the powerful Google Gemini models for content generation and analysis, combined with on-device embeddings for a privacy-preserving RAG implementation.

## ✨ Features

*   **AI Post Generation (Gemini Pro)**: Create compelling posts from simple prompts (goal, details, tone). The app generates three variations for you to choose from.
*   **Style Library (RAG)**: Teach the AI your personal writing style by adding your successful posts to a local knowledge base. The AI uses this to generate new posts in *your* voice, powered by on-device embeddings for privacy and Gemini Pro for generation.
*   **AI-Powered Post Analysis (Gemini Pro)**: Get a comprehensive analysis of your draft post. The AI provides a score, lists strengths and improvements, and writes a revised version for you.
*   **Privacy-First RAG**: The Retrieval-Augmented Generation (RAG) feature uses an on-device model to create embeddings of your posts, so your personal style library never leaves your browser. Generation is then handled by Gemini.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI / Machine Learning**:
    *   **Google Gemini API (`@google/genai`)**: For all server-side text generation (`gemini-2.5-pro`) and embedding (`gemini-2.5-flash`) tasks.
    *   **Transformers.js (`@xenova/transformers`)**: For running the embedding model (`all-MiniLM-L6-v2`) entirely in the browser to power the RAG style library while preserving user privacy.
*   **Build Tool**: Vite

## 🚀 Getting Started

Follow these instructions to set up and run the React application on your local machine.

### Prerequisites

*   **Node.js**: Make sure you have Node.js (version 18 or higher) and npm installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **Gemini API Key**: You will need a Google Gemini API key.

### Local Setup & Installation

**1. Create an Environment File**

In the root of the project, create a file named `.env`. Add your Gemini API key to this file:

```
API_KEY=YOUR_GEMINI_API_KEY
```

**2. Install Dependencies**

This project uses `npm` to manage its dependencies. Open your terminal in the project's root directory and run:

```bash
npm install
```

This will download all the necessary packages defined in `package.json`.

### Running the Application

1.  Start the development server:

    ```bash
    npm run dev
    ```

2.  Open your web browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

> **Note**: The first time you load the application, it will download a small on-device AI model for the RAG feature. This happens only once and subsequent loads will be faster. A loading screen will show the progress.

## 🏛️ Architecture

For a detailed breakdown of the application's components, data flows, and AI workflows, please open the `architecture.html` file in your browser.
