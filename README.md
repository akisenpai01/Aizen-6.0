# Aizen

This is a NextJS starter in Firebase Studio, customized into Aizen, an AI assistant with a samurai personality.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set up API Key:**
    *   A file named `.env.local` has been created in the root directory of the project. This file is included in `.gitignore` and will not be committed.
    *   Open `.env.local` and replace `YOUR_API_KEY_HERE` with your actual Google AI API key:
        ```dotenv
        GOOGLE_API_KEY=YOUR_API_KEY_HERE
        ```
    *   You can obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Important**: After setting your API key, you may need to restart your development server (`npm run dev`) for the changes to take effect.

3.  **Run the Development Servers:**
    *   **Next.js App:** Open a terminal and run:
        ```bash
        npm run dev
        ```
        This will start the main application, usually on `http://localhost:9002`.
    *   **Genkit AI Flows:** Open a *separate* terminal and run:
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit server required for the AI features.

4.  **Access the App:**
    Open your web browser and navigate to `http://localhost:9002`.

## VS Code Setup

### Recommended Extensions

*   **ESLint:** Integrates ESLint into VS Code.
*   **Prettier - Code formatter:** Formats your code automatically on save.
*   **Tailwind CSS IntelliSense:** Provides autocompletion, linting, and syntax highlighting for Tailwind CSS.
*   **EditorConfig for VS Code:** Helps maintain consistent coding styles.

### Settings (`.vscode/settings.json`)

Ensure your `.vscode/settings.json` file includes the following for optimal development experience:

```json
{
    "IDX.aI.enableInlineCompletion": true,
    "IDX.aI.enableCodebaseIndexing": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode", // Set Prettier as default
    "editor.formatOnSave": true,                      // Format code on save
    "javascript.validate.enable": false,              // Disable built-in JS validation (use ESLint)
    "typescript.validate.enable": true,               // Enable TS validation
    "eslint.validate": [                              // Files ESLint should validate
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    "files.associations": {
      "*.css": "tailwindcss" // Associate CSS files with Tailwind
    },
    "editor.quickSuggestions": {
      "strings": true // Enable suggestions within strings for Tailwind classes
    }
}
```

To explore the code, take a look at `src/app/page.tsx`.
# Aizen-3.0
# Aizen-3.0
