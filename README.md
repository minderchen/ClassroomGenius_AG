<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1lTFADI1LUgmKX8jm_4BwBsjdy1iI-YZc

## Run Locally

**Prerequisites:** Node.js (v20 or later recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Build for Production

To create a production-ready build:
```bash
npm run build
```
The output will be in the `dist/` directory.

## Deployment

This project includes a GitHub Action for automatic deployment to **GitHub Pages**.

### Continuous Deployment (CI/CD)
The workflow is defined in `.github/workflows/deploy.yml`. It triggers automatically when you push to the `main` branch.

### Configuring Secrets
For the deployment to work, you must add your `GEMINI_API_KEY` to your GitHub repository secrets:
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Secrets and variables** > **Actions**.
3. Create a new repository secret named `GEMINI_API_KEY` with your API key value.

### Enabling GitHub Pages
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
