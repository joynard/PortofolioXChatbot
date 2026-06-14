# DevHub.AI Personal Chatbot & GitHub Portfolio

A premium personal portfolio website equipped with an integrated AI chat workspace powered by the Google AI Studio API (supporting Gemini models) and a dynamically updated GitHub repository listing.

## Key Features

1. **Portfolio Hub**:
   - Displays your GitHub profile details along with stats (Repositories, Followers, Following).
   - Renders an interactive grid of your public repositories.
   - Features instant search/filtering by repository name, description, or programming language.
   - Direct links to individual GitHub project repositories and your main profile page.
   
2. **AI Workspace**:
   - Interact directly with state-of-the-art AI models like the **Gemini 3.5/2.5/2.0** series.
   - Supports full Markdown formatting, code block syntax highlighting, lists, tables, and blockquotes.
   - Preset starter questions to speed up interactions.
   - Session caching: chat history is preserved when switching tabs.

3. **Secure Settings**:
   - Storing Google AI Studio API Key credentials directly in your browser's `localStorage`. Your API key remains secure and is never uploaded to GitHub.
   - Dynamic GitHub username configuration.

4. **Premium Design**:
   - Obsidian theme with modern warm amber/bronze glassmorphism styling.
   - Responsive across all device form factors (Mobile, Tablet, Desktop).
   - Smooth, fluid, and organic transitions.

---

## How to Run Locally

Make sure you have [Node.js](https://nodejs.org/) installed.

1. **Clone the Repository**:
   ```bash
   git clone <your-repository-url>
   cd Chatbot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## How to Deploy to GitHub Pages

This project is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically compile and host the app on GitHub Pages for free.

1. **Create a New Repository on GitHub** (e.g., `my-portfolio`).
2. **Initialize Git and Push**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with DevHub.AI"
   git branch -M main
   git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. **Configure GitHub Actions Workflow Permissions**:
   - Open your repository page on GitHub.
   - Navigate to **Settings** -> **Actions** -> **General**.
   - Scroll down to the **Workflow permissions** section, select **Read and write permissions**, and click **Save**.
4. **Configure GitHub Pages Source**:
   - Once the Action run completes successfully (check the **Actions** tab on GitHub), a new branch named `gh-pages` will be automatically created.
   - Go to **Settings** -> **Pages** in the left sidebar.
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `gh-pages` and the `/ (root)` folder, and click **Save**.
   - Your website will go live in a few minutes at `https://<your-github-username>.github.io/<your-repo-name>/`.
