# Make.com Scenario Setup Guide

This guide helps you fix the chatbot so it correctly receives and answers user questions. The site sends questions to your Make.com webhook as `?question=YourQuestion`; the scenario must pass this to the AI module.

## Quick Fix Checklist

1. Open your scenario: [https://us2.make.com/1902122/scenarios/4207541/edit](https://us2.make.com/1902122/scenarios/4207541/edit)
2. In the **Webhooks** module, ensure the `question` query parameter is captured
3. In the **AI** module (OpenAI/ChatGPT), use `{{1.question}}` as the user message
4. Map the AI response to the webhook response as `reply`
5. Save and run a test

---

## Step-by-Step Instructions

### Step 1: Open Your Scenario

1. Log in at [make.com](https://www.make.com)
2. Go to: [https://us2.make.com/1902122/scenarios/4207541/edit](https://us2.make.com/1902122/scenarios/4207541/edit)

### Step 2: Configure the Webhook Module

The Webhooks module is the first module in your scenario (trigger).

1. Click the **Webhooks** module
2. In the webhook settings, look for **Data structure** or **Query parameters**
3. For GET requests, the webhook automatically captures query parameters:
   - Our site sends: `https://hook.us2.make.com/...?question=Hello`
   - The `question` value should be available as `{{1.question}}` or `{{question}}`
4. If you don't see `question` in the output, click **Add item** / **Run once** and send a test request with `?question=test` to trigger the webhook and populate the structure

### Step 3: Wire the Question into the AI Module

1. Click the **AI** module (OpenAI, ChatGPT, or similar)
2. Find the **User message** or **Prompt** field
3. Replace any placeholder text with the webhook variable:
   - Use `{{1.question}}` (if Webhooks is module 1)
   - Or `{{question}}` depending on how Make.com labels it
4. Click **OK** to save

### Step 4: Map the Response to the Webhook

1. Find the **Respond to Webhook** or **Webhook Response** module (usually the last module)
2. In the response body, set:
   - **reply** = `{{AI_module.output}}` (or whatever your AI module outputs)
   - The site expects a JSON object with a `reply` field, e.g. `{"reply": "Your answer here"}`

### Step 5: Test

1. Click **Run once** in Make.com
2. When prompted, open this URL in your browser (replace with your actual question):
   ```
   https://hook.us2.make.com/vtghxv8gwlwrhsffl8yl9uh1vpv9k6mb?question=What%20is%20your%20name
   ```
3. Check the execution: the AI module should receive "What is your name" and return a real answer
4. Save the scenario and turn it **ON** if it's off

---

## Expected Data Flow

```
Site (GET)  →  Webhook (?question=...)  →  AI ({{1.question}})  →  Response (reply)  →  Site
```

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| AI says "Please provide the incoming question" | The AI module is not receiving `{{1.question}}`. Check Step 3. |
| Empty or generic response | Verify the response module returns `{"reply": "..."}` |
| Webhook not triggering | Ensure the scenario is **ON** and the webhook URL is correct |
| CORS errors in browser | Make.com webhooks allow cross-origin requests; if you see CORS errors, check the browser console for the actual error |

---

## Webhook URL Reference

Your current webhook URL (in `script.js`):

```
https://hook.us2.make.com/vtghxv8gwlwrhsffl8yl9uh1vpv9k6mb
```

The site sends: `GET {webhookUrl}?question={encoded_user_message}`
