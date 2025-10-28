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
    *   **TensorFlow & Keras (Python)**: For training the custom engagement prediction model.
*   **Build Tool**: Vite

## 🚀 Getting Started: Frontend Application

Follow these instructions to set up and run the React application on your local machine.

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

---

## 🧠 Training Your Own Deep Learning Model

This project includes a complete Python script and Jupyter Notebook to train your own engagement prediction model. This allows you to experiment with deep learning concepts and potentially replace the simulated model in the frontend with a real one.

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

Execute the `train_model.py` script to start the training process.

```bash
python train_model.py
```

The script will:
1.  Load the dataset from `data/linkedin_posts_dataset.csv`.
2.  Preprocess the text data.
3.  Build a neural network with Embedding and LSTM layers.
4.  Train the model.
5.  Evaluate its performance and save the trained model to a file (`engagement_model.h5`).

**4. Explore with Jupyter Notebook**

For a more interactive, step-by-step guide through the training process, you can use the `model_training.ipynb` notebook. Make sure you have Jupyter installed (`pip install notebook`) and run:

```bash
jupyter notebook
```

Then, open the `model_training.ipynb` file in the Jupyter interface.


## 🏛️ Architecture

For a detailed breakdown of the application's components, data flows, and AI workflows, please open the `architecture.html` file in your browser.
