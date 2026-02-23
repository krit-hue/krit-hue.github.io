// script.js
// Handles sending messages to a Make.com scenario webhook and displaying
// responses in the chat interface.

document.addEventListener('DOMContentLoaded', () => {
    // TODO: Replace this with your actual Make.com webhook URL
    const webhookUrl = 'YOUR_MAKE_WEBHOOK_URL';

    const messagesEl = document.getElementById('messages');
    const userInputEl = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    /**
     * Appends a message element to the messages container.
     *
     * @param {string} text - The message text
     * @param {string} type - Either 'user' or 'bot' to style the message
     */
    function appendMessage(text, type) {
        const msgEl = document.createElement('div');
        msgEl.classList.add('message', type);
        msgEl.textContent = text;
        messagesEl.appendChild(msgEl);
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

        // Show a temporary loading indicator for the bot
        const loadingEl = document.createElement('div');
        loadingEl.classList.add('message', 'bot');
        loadingEl.textContent = '…';
        messagesEl.appendChild(loadingEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text
                })
            });
            let replyText;
            if (response.ok) {
                // Expect JSON reply with a 'reply' field or similar
                const data = await response.json();
                replyText = data.reply || JSON.stringify(data);
            } else {
                replyText = 'Sorry, I couldn\'t reach my assistant. Please try again later.';
            }
            // Remove loading indicator and append the reply
            loadingEl.remove();
            appendMessage(replyText, 'bot');
        } catch (err) {
            loadingEl.remove();
            appendMessage('Error: ' + err.message, 'bot');
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