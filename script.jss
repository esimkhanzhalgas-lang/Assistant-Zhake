async function sendMessage() {
    const key = apiKeyField.value.trim();
    const text = userInput.value.trim();

    if (!key) { 
        alert("API кілтті енгізіңіз!"); 
        return; 
    }
    if (!text) return;

    appendMessage(text, 'user-message');
    userInput.value = "";

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.innerHTML = '<div class="message-content">Ойланып жатырмын...</div>';
    chatMessages.appendChild(typingDiv);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: text }]
            })
        });

        const data = await response.json();
        chatMessages.removeChild(typingDiv);

        if (response.ok) {
            typeEffect(data.choices[0].message.content);
        } else {
            // Қате туралы толық ақпаратты шығару
            console.error("OpenAI Error:", data);
            appendMessage("Қате: " + data.error.message, 'bot-message');
        }
    } catch (error) {
        chatMessages.removeChild(typingDiv);
        console.error("Network Error:", error);
        appendMessage("Байланыс қатесі: Интернетті немесе API-ді тексеріңіз.", 'bot-message');
    }
}
