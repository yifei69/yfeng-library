# Week 11 and Week 12 submission checklist

Submit one PDF on Moodle. Start each evidence item on a new page with a descriptive heading.

- Task 11.1: Working Cloudflare project URL and evidence of deployment from Git.
- Task 11.1: Working URL and evidence of a real C3 / IDE deployment.
- Task 11.2 (D/HD): Working deployed weather page screenshot including browser address bar.
- Task 12.1: Working GitHub Pages URL and screenshot showing the GitHub Actions workflow running. Also capture successful completion where possible.
- Task 12.2 (D/HD): TTFB research answer and references.
- Task 12.2 (D/HD): Hotlinking research answer and references.

Evidence must come from actual deployments. Do not replace missing screenshots with mockups.

Research draft: week12-research.md.
Expected GitHub Pages URL (requires live verification): https://yifei69.github.io/yfeng-library/

Cloudflare Git deployment build settings:
- Build command: npm run build
- Output directory: dist
- Base path: / (leave VITE_BASE_PATH unset)
- Configure Firebase VITE_* environment variables from the existing local configuration without publishing the .env.local file.
- Add the deployed hostname to Firebase Authentication authorized domains if required by the authentication method.
