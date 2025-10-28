<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1j61mv-wktPQ-8t1SGSGg2Tev1pdLwRoe

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


Prerequisites
Before you begin, make sure you have the following installed on your computer:
Node.js (LTS version): This is the JavaScript runtime that will execute your project's build tools. It also includes npm (Node Package Manager), which you'll use to install project dependencies.
Download Node.js here
Visual Studio Code: The code editor where you'll be working.
Download VS Code here
Step 1: Create Your Project Folder and File Structure
First, organize all the files you have into the correct folder structure.
Create a main folder for your project. Let's call it linkedin-optimizer.
Open this linkedin-optimizer folder in VS Code.
Inside VS Code, recreate the following structure. You will create each folder and then create a file inside it, pasting the content you have for that file.
code
Code
linkedin-optimizer/
├── .env                  <-- You will CREATE this file in Step 4
├── index.html
├── package.json          <-- You will CREATE this file in Step 2
├── architecture.html
├── metadata.json
├── requirements.txt      <-- (Note: This file is for Python and not used by this React app, but you can keep it for reference)
└── src/
    ├── App.tsx
    ├── index.tsx
    ├── constants.ts
    ├── types.ts
    ├── components/
    │   ├── EngagementPredictor.tsx
    │   ├── GeneratedPost.tsx
    │   ├── Header.tsx
    │   ├── Loader.tsx
    │   ├── PostAnalyzer.tsx
    │   ├── PostGenerator.tsx
    │   ├── RealtimeAnalysis.tsx
    │   ├── StyleLibraryManager.tsx
    │   └── icons/
    │       ├── BookOpenIcon.tsx
    │       ├── CheckIcon.tsx
    │       ├── CopyIcon.tsx
    │       ├── DatabaseIcon.tsx
    │       ├── HookIcon.tsx
    │       ├── LightbulbIcon.tsx
    │       ├── LinkedinIcon.tsx
    │       ├── MegaphoneIcon.tsx
    │       ├── ShieldCheckIcon.tsx
    │       ├── SparklesIcon.tsx
    │       ├── TagIcon.tsx
    │       ├── ThumbsUpIcon.tsx
    │       └── TrashIcon.tsx
    ├── data/
    │   └── mockEngagementData.ts
    ├── hooks/
    │   └── useLocalStorage.ts
    └── services/
        ├── engagementPredictorService.ts
        ├── geminiService.ts
        └── localModelService.ts
Step 2: Create the package.json File
This file is the "brain" of your project. It tells Node.js what your project's dependencies are and defines key scripts to run it.
In the root of your linkedin-optimizer folder, create a new file named package.json and paste the following content into it:
code
JSON
{
  "name": "linkedin-post-optimizer",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.27.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.0.2",
    "vite": "^5.0.0"
  }
}
This file sets up Vite, a modern, super-fast build tool for web projects, which is perfect for your application.
Step 3: Install Project Dependencies
Now that you've defined what your project needs in package.json, you can install everything with a single command.
Open the terminal directly within VS Code (View -> Terminal or `Ctrl+``).
Make sure your terminal is in the linkedin-optimizer directory.
Run the following command:
code
Bash
npm install
This command will read your package.json file, download all the listed packages (React, Vite, TypeScript, etc.), and place them into a new folder called node_modules. This might take a minute.
Step 4: Set Up Your Environment Variable (API Key)
Your application needs your Gemini API key to work. You should never hardcode keys directly in your code.
In the root of your linkedin-optimizer folder, create a new file named .env.
Inside the .env file, add the following line, replacing YOUR_GEMINI_API_KEY_HERE with your actual key:
code
Code
VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
Important: The VITE_ prefix is required by the Vite build tool to securely expose the variable to your frontend code.
Because of this, we need to make one small but crucial change to the geminiService.ts file so it can correctly read this variable.
src/services/geminiService.ts
check_circle
Step 5: Run the Application
You are now ready to start the development server!
In your VS Code terminal, run the following command:
code
Bash
npm run dev
You will see some output in your terminal, and it will give you a Local URL. It will look something like this:
code
Code
VITE v5.0.0  ready in 312 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
Open that URL (http://localhost:5173/) in your web browser.
You should now see your LinkedIn Post Optimizer application running live! Any changes you make to the code will instantly update in the browser.
Recommended VS Code Extensions
To make your development experience smoother, I highly recommend installing these extensions in VS Code:
ESLint: Helps find and fix problems in your JavaScript/TypeScript code.
Prettier - Code formatter: Automatically formats your code to keep it clean and consistent.
Tailwind CSS IntelliSense: Provides autocomplete, syntax highlighting, and linting for Tailwind CSS classes used in your project.
