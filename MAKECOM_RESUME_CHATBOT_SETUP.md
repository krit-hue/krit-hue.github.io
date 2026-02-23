# Make.com Resume Chatbot – Setup Guide

This guide walks you through building a Make.com scenario that answers questions about Kritesh's resume. The chatbot on your site sends questions via webhook; the scenario uses OpenAI to answer based on the resume content.

## Prerequisites

- Make.com account (free or paid)
- OpenAI API key ([platform.openai.com](https://platform.openai.com))
- Resume context: use `kritesh-resume-context.txt` in this repo

---

## Option A: Build the Scenario Manually (Recommended)

### Step 1: Create a New Scenario

1. Log in at [make.com](https://www.make.com)
2. Click **Create a new scenario**
3. Name it: **Kritesh Resume Chatbot**

### Step 2: Add the Custom Webhook (Trigger)

1. Click the **+** to add the first module
2. Search for **Webhooks** (under **Tools**)
3. Select **Custom webhook**
4. Click **Add** to create a new webhook
5. In **Data structure**, add a query parameter:
   - Click **Add item**
   - **Label**: `question`
   - **Type**: Text
   - **Required**: Yes (or No – your site always sends it)
6. Click **OK** – Make.com will show you the webhook URL
7. **Copy the webhook URL** – you’ll need it for `script.js` if this is a new scenario

### Step 3: Add the OpenAI Module

1. Click the **+** after the Webhooks module
2. Search for **OpenAI**
3. Select **Create a Chat Completion** (or **Create a Chat Completion (GPT)**)
4. Connect your OpenAI account (add API key if needed)
5. Configure:
   - **Model**: `gpt-4o-mini` or `gpt-3.5-turbo` (for cost)
   - **Messages**:
     - **Role**: System  
       **Content**: Paste the **entire content** of `kritesh-resume-context.txt` from this repo. It should start with:  
       `You are Kritesh Shiwakoti's personal assistant. Use the following resume to answer questions...`  
       (Or use the full resume text from that file.)
     - **Role**: User  
       **Content**: `{{1.question}}`  
       (This maps the `question` from the webhook to the user message.)
6. Click **OK**

### Step 4: Add the Webhook Response

1. Click the **+** after the OpenAI module
2. Search for **Webhooks** again
3. Select **Respond to a webhook**
4. Configure:
   - **Status**: `200`
   - **Headers**: Leave default or add `Content-Type: application/json`
   - **Body type**: Raw
   - **Request content**: 
     ```json
     {
       "reply": "{{2.message.content}}"
     }
     ```
     (Use `{{2.message.content}}` or whatever your OpenAI module outputs – check the output mapping. It might be `{{2.choices[0].message.content}}` or similar.)
5. Click **OK**

### Step 5: Map the OpenAI Output Correctly

The exact path for the OpenAI response depends on the module version:

- Try: `{{2.message.content}}`
- Or: `{{2.choices[0].message.content}}`
- Or: `{{2.data.choices[0].message.content}}`

In the **Respond to a webhook** module, open the mapping panel and select the **content** or **text** field from the OpenAI module’s output.

### Step 6: Save and Test

1. Click **Save** (bottom left)
2. Turn the scenario **ON** (toggle in bottom left)
3. Test with:
   ```
   https://YOUR-WEBHOOK-URL?question=What%20is%20Kritesh%27s%20current%20role
   ```
4. You should get a JSON response like: `{"reply": "Kritesh is an Advisor, Configuration Management Engineer at CVS Health..."}`

### Step 7: Update Your Site

If you created a **new** webhook (new scenario):

1. Open `script.js` in this repo
2. Replace `webhookUrl` with your new webhook URL
3. Commit and push – GitHub Pages will redeploy

---

## Option B: Import Blueprint

Try importing one of the blueprint JSON files:

1. In Make.com: **Create a new scenario** → **⋯** (three dots) → **Import blueprint**
2. Select `make-scenario-resume-chatbot.json` or `make-scenario-resume-chatbot-v2.json`
3. If import succeeds:
   - **OpenAI module**: Connect your OpenAI account (add API key)
   - **Webhook**: Ensure the `question` parameter is in the data structure
   - **Respond to webhook**: Verify the body uses `{{2.choices.0.message.content}}` or `{{2.message.content}}` (check the output mapping in the OpenAI module)
4. **Update script.js**: Replace `webhookUrl` with the new webhook URL from the imported scenario
5. Save, turn ON, and test

**If import fails:** Make.com's blueprint format can vary. Use **Option A** (manual build) – it takes about 5 minutes and always works.

---

## Resume Context File

The file `kritesh-resume-context.txt` contains the full resume text. Use it as the **System message** (or equivalent) in the OpenAI module so the AI can answer from Kritesh’s experience, skills, and education.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Please provide the incoming question" | The AI is not receiving `{{1.question}}`. Check the User message in the OpenAI module. |
| Empty or wrong reply | Verify the response mapping in **Respond to a webhook** – use the correct output path from the OpenAI module. |
| Webhook returns "Accepted" | Scenario is OFF or not running. Turn it ON and test again. |
| CORS errors | Make.com webhooks usually allow cross-origin requests. Check the browser console for the real error. |

---

## Data Flow

```
Site (GET ?question=...) → Webhook → OpenAI (System: resume + User: question) → Respond to webhook (reply) → Site
```
