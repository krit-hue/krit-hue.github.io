// script.js
// Handles sending messages to a Make.com scenario webhook and displaying
// responses in the chat interface.

document.addEventListener('DOMContentLoaded', () => {
    // URL of your Make.com webhook. Messages will be sent here and the
    // response returned will be displayed in the chat. Update this if you
    // change your scenario or create a new webhook in Make.com.
    const webhookUrl = 'https://hook.us2.make.com/vtghxv8gwlwrhsffl8yl9uh1vpv9k6mb';

    const messagesEl = document.getElementById('messages');
    const userInputEl = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    /**
     * Creates and appends a chat message to the messages container. Each
     * message is wrapped with an avatar so that visitors can clearly see
     * which side (user vs assistant) the message comes from. The wrapper
     * ensures the avatar sits alongside the bubble and aligns the
     * conversation appropriately.
     *
     * @param {string} text - The message text
     * @param {string} type - Either 'user' or 'assistant' to style the message
     */
    function appendMessage(text, type) {
        const wrapperEl = document.createElement('div');
        wrapperEl.classList.add('message-wrapper', type);

        // Avatar image. Pick the appropriate graphic based on sender.
        const avatarEl = document.createElement('img');
        avatarEl.classList.add('avatar');
        avatarEl.src = type === 'user' ? 'user-avatar.png' : 'assistant-avatar.png';
        avatarEl.alt = type === 'user' ? 'You' : 'Assistant';

        // Actual message bubble
        const msgEl = document.createElement('div');
        msgEl.classList.add('message', type);
        msgEl.textContent = text;

        // For user messages we append in reverse order so the avatar stays
        // on the correct side when flex-direction is reversed.
        if (type === 'user') {
            wrapperEl.appendChild(msgEl);
            wrapperEl.appendChild(avatarEl);
        } else {
            wrapperEl.appendChild(avatarEl);
            wrapperEl.appendChild(msgEl);
        }

        messagesEl.appendChild(wrapperEl);
        // Scroll to the bottom of the chat
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    /**
     * Sends the user's message to the Make.com scenario via a webhook.
     */
    async function sendMessage() {
        const text = userInputEl.value.trim();
        if (!text) return;
        // Append the user's message to the chat
        appendMessage(text, 'user');
        userInputEl.value = '';

        // Show a temporary loading indicator for the assistant
        const loadingWrapper = document.createElement('div');
        loadingWrapper.classList.add('message-wrapper', 'assistant');
        const loadingAvatar = document.createElement('img');
        loadingAvatar.classList.add('avatar');
        loadingAvatar.src = 'assistant-avatar.png';
        loadingAvatar.alt = 'Assistant';
        const loadingBubble = document.createElement('div');
        loadingBubble.classList.add('message', 'assistant');
        loadingBubble.textContent = '…';
        loadingWrapper.appendChild(loadingAvatar);
        loadingWrapper.appendChild(loadingBubble);
        messagesEl.appendChild(loadingWrapper);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        try {
            // Build a GET request URL by appending the user question as a query parameter.
            // Some Make.com webhooks only accept GET requests and ignore POST bodies.
            const url = `${webhookUrl}?question=${encodeURIComponent(text)}`;
            const response = await fetch(url, {
                method: 'GET'
            });
            let replyText;
            if (response.ok) {
                // Read the response body as text once. We'll attempt to parse it as JSON.
                const textResponse = await response.text();
                try {
                    const data = JSON.parse(textResponse);
                    replyText = data.reply || data.answer || data.response || JSON.stringify(data);
                } catch (parseErr) {
                    replyText = textResponse;
                }
                // If the Make.com webhook responds with a generic or empty acknowledgement
                // (like "Accepted"), fall back to the local resume content. This ensures
                // visitors still get a meaningful answer if the scenario doesn’t immediately
                // produce a JSON reply.
                const normalized = (replyText || '').trim().toLowerCase();
                if (!normalized || normalized === 'accepted') {
                    try {
                        const resumeResp = await fetch('resume.md');
                        replyText = await resumeResp.text();
                    } catch (resumeErr) {
                        replyText = 'Sorry, I couldn\'t fetch my resume information.';
                    }
                }
            } else {
                // On HTTP errors, attempt to serve the resume as a fallback.
                try {
                    const resumeResp = await fetch('resume.md');
                    replyText = await resumeResp.text();
                } catch (resumeErr) {
                    replyText = 'Sorry, I couldn\'t reach my assistant. Please try again later.';
                }
            }
            // Remove loading indicator and append the reply
            loadingWrapper.remove();
            appendMessage(replyText, 'assistant');
        } catch (err) {
            loadingWrapper.remove();
            appendMessage('Error: ' + err.message, 'assistant');
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInputEl.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
});