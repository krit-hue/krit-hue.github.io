# Assistant Chatbot Site

This repository hosts the static site for your personal assistant chatbot, built with GitHub Pages. The site allows visitors to read about you, view your resume, and interact with a chatbot powered by a Make.com scenario.

## How to deploy

The site will be automatically deployed using GitHub Pages once the contents are pushed to the `main` branch of this repository.

## Contents

- `index.html` – The main page containing sections for **About Me**, **Resume**, and an interactive chat interface.
- `styles.css` – Standalone stylesheet defining the look and feel of the site, including typography, colors, and layout.
- `script.js` – Client‑side JavaScript that sends user messages to your Make.com scenario and displays responses.
- `resume.md` – A Markdown file with a template for your resume. Replace the placeholder content with your actual experience and education.
- `kritesh-resume-context.txt` – Resume content for the Make.com AI assistant (used as system prompt).
- `MAKECOM_RESUME_CHATBOT_SETUP.md` – Step-by-step guide to build the Make.com scenario with resume-based answers.
- `make-scenario-resume-chatbot.json` – Make.com blueprint (import may require manual configuration).
- `README.md` – This file.

## How to integrate with Make.com

The chat on this site sends user questions to a Make.com scenario via a webhook. To connect the chatbot to your scenario:

1. In Make.com, create (or open) your scenario and generate a webhook. Copy the webhook URL provided by Make.
2. Edit the file `script.js` in this repository and replace the webhook URL with your actual webhook URL.
3. **Important:** In your Make.com scenario, wire the `question` query parameter into the AI module. See **[MAKECOM_SETUP.md](MAKECOM_SETUP.md)** for step-by-step instructions.
4. Commit and push the changes to the `main` branch. GitHub Pages will automatically redeploy the site with the updated integration.

## Customization

- **Text & Content:** Update the **About Me** section in `index.html` with your story. Replace the placeholder headings and paragraphs with your own words and add emojis or icons as desired.
- **Resume:** Fill in `resume.md` with your real resume details. You can also upload a PDF version and link to it from the Resume section.
- **Styling:** Modify `styles.css` to tweak colors, fonts, and layout. The site currently uses Google Fonts and Font Awesome icons, but you can choose different fonts or icons if you prefer.
- **Functionality:** Expand `script.js` to handle more complex interactions or parse responses returned by your Make scenario.

---

This project was generated automatically to help you launch your personal assistant chatbot on GitHub Pages. Feel free to modify and expand it to suit your needs.
