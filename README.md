# LinkedIn Post Optimizer

An AI-powered tool to help users generate and revise engaging, effective LinkedIn posts. This application runs entirely in your browser, using local AI models for content generation and Retrieval-Augmented Generation (RAG) to learn your unique posting style. It also includes real-time analysis to provide instant feedback on post quality and safety, all while keeping your data private.

## ✨ Features

*   **AI Post Generation**: Create compelling posts from simple prompts (goal, details, tone).
*   **Style Library (RAG)**: Teach the AI your personal writing style by adding your successful posts to a local knowledge base.
*   **AI-Powered Revision**: Revise existing drafts to improve clarity, engagement, and professionalism, complete with an AI-generated quality score.
*   **Hashtag & Keyword Suggestions**: Generate relevant and trending hashtags and keywords for your content.
*   **Real-time Engagement Prediction**: Get instant feedback on your draft's potential for engagement based on a custom deep learning model.
*   **Content Safety Analysis**: A client-side toxicity model checks your content in real-time to ensure professionalism.
*   **Privacy-First**: All processing happens on your device. Your data is never sent to a server.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI / Machine Learning (In-Browser)**:
    *   **Transformers.js (`@xenova/transformers`)**: For running state-of-the-art LLMs (`LaMini-Flan-T5-77M`) and embedding models (`all-MiniLM-L6-v2`) directly in the browser.
    *   **TensorFlow.js**: For running the custom-trained engagement prediction model client-side.
    *   **TensorFlow.js Toxicity Model**: For client-side content safety analysis.
*   **Model Training (Optional)**:
    *   **Python, TensorFlow & Keras**: For training the custom engagement prediction model.
*   **Build Tool**: Vite

## 🚀 Getting Started: Frontend Application

Follow these instructions to set up and run the React application on your local machine. No API keys are needed!

### Prerequisites

*   **Node.js**: Make sure you have Node.js (version 18 or higher) and npm installed. You can download it from [nodejs.org](https://nodejs.org/).

### Local Setup & Installation

**1. Install Dependencies**

This project uses `npm` to manage its dependencies. Open your terminal in the project's root directory and run:

```bash
npm install
```

This will download all the necessary packages defined in `package.json`.

**2. That's it!**

There are no environment variables or API keys to configure.

### Running the Application

1.  Start the development server:

    ```bash
    npm run dev
    ```

2.  Open your web browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

> **Note**: The first time you load the application, it will download the AI models to your browser's cache. This might take a minute, but subsequent loads will be much faster.

---

## 🧠 Training Your Own Deep Learning Model

This project includes a complete Python script and Jupyter Notebook to train your own engagement prediction model. This allows you to experiment with deep learning concepts and replace the provided model with your own.

### Prerequisites

*   **Python**: Ensure you have Python 3.8+ installed.
*   **Pip**: Python's package installer.

### Setup & Training

**1. Create a Virtual Environment (Recommended)**

It's best practice to create a virtual environment to manage the project's Python dependencies.

```bash
# Create the environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

**2. Install Python Dependencies**

Install all the required libraries using the `requirements.txt` file.

```bash
pip install -r requirements.txt
```

**3. Run the Training Script**

The project includes a `train_model.py` script (not included in this file list, but part of a complete training setup) to start the training process.

The script will:
1.  Load the dataset from `data/linkedin_posts_dataset.csv`.
2.  Preprocess the text data.
3.  Build a neural network with Embedding and LSTM layers.
4.  Train the model.
5.  Save the trained model and tokenizer.

**4. Convert Model for Web Usage**

After training, the Keras model (e.g., `.h5` or `.keras`) must be converted to the TensorFlow.js Layers format (`model.json` and weight shards) for use in the web app.

```bash
# Install the converter
pip install tensorflowjs

# Run the converter
tensorflowjs_converter --input_format keras \
                       path/to/your/engagement_model.h5 \
                       path/to/your/public/engagement_model/
```
This command will generate the necessary files to be loaded by the `engagementPredictorService`.


## 🏛️ Architecture

For a detailed breakdown of the application's components, data flows, and AI workflows, please open the `architecture.html` file in your browser.