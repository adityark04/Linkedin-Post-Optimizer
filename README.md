# LinkedIn Post Optimizer

An AI-powered tool to help users generate and revise engaging, effective LinkedIn posts. This application leverages the Google Gemini API for content generation and Retrieval-Augmented Generation (RAG) to learn your unique posting style. It also includes real-time analysis to provide instant feedback on post quality and safety.

## ✨ Features

*   **AI Post Generation**: Create compelling posts from simple prompts (goal, details, tone).
*   **Style Library (RAG)**: Teach the AI your personal writing style by adding your successful posts to a knowledge base.
*   **AI-Powered Revision**: Revise existing drafts to improve clarity, engagement, and professionalism, complete with an AI-generated quality score.
*   **Hashtag Suggestions**: Generate relevant and trending hashtags for your content.
*   **Real-time Engagement Prediction**: Get instant feedback on your draft's potential for engagement based on a simulated deep learning model.
*   **Content Safety Analysis**: A client-side toxicity model checks your content in real-time to ensure professionalism.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI / Machine Learning**:
    *   **Google Gemini API (`gemini-2.5-flash`)**: For post generation, revision, and RAG.
    *   **Google Embedding Models (`text-embedding-004`)**: For creating vector representations of text for RAG.
    *   **TensorFlow.js & Toxicity Model**: For client-side content safety analysis.
*   **Build Tool**: Vite

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

*   **Node.js**: Make sure you have Node.js (version 18 or higher) and npm installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **Gemini API Key**: You need an API key from Google AI Studio. You can get one [here](https://aistudio.google.com/app/apikey).

### Local Setup & Installation

**1. Install Dependencies**

This project uses `npm` to manage its dependencies. Open your terminal in the project's root directory and run:

```bash
npm install
```

This will download all the necessary packages defined in `package.json`.

**2. Configure Environment Variable**

For security, your API key should not be hardcoded in the source code.

*   In the root directory of the project, create a new file named `.env`.
*   Add your Gemini API key to this file like so:

```
VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
> **IMPORTANT**: The `VITE_` prefix is required for the project's build tool (Vite) to recognize the variable.

### Running the Application

1.  Start the development server:

    ```bash
    npm run dev
    ```

2.  Open your web browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

You should now see the application running!

## 🏛️ Architecture

For a detailed breakdown of the application's components, data flows, and AI workflows, please open the `architecture.html` file in your browser.
