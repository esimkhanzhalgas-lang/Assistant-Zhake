// Түймелерді және элементтерді алу
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

// Сұраныс жіберу функциясы
async function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    // 1. Пайдаланушы хабарламасын әдемі анимациямен қосу
    appendMessage(text, 'user-message');
    userInput.value = ""; 

    // 2. ЖИ-дің "Ойланып жатқан" индикаторын көрсету
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        // НАҒЫЗ OpenAI API-мен байланыс (Ерекше стильде)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer SIZDIN_API_KEY_OSYNDA` // Осында кілтті қойыңыз
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: text }],
                temperature: 0.8 // Шығармашылық деңгейі
            })
        });

        const data = await response.json();
        typingDiv.remove(); // Индикаторды алып тастау

        if (data.choices && data.choices[0]) {
            const aiText = data.choices[0].message.content;
            // ЖИ жауабын "басылып жатқан" эффектімен шығару
            typeWriter(aiText);
        } else {
            appendMessage("Қате: API кілтіңізді тексеріңіз.", 'ai-message');
        }

    } catch (error) {
        typingDiv.remove();
        appendMessage("Жүйеде қате пайда болды. Қайта көріңіз.", 'ai-message');
    }
}

// Хабарламаны экранға шығару функциясы
function appendMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
}

// "Typewriter" (Жазу машинкасы) эффектісі
function typeWriter(text) {
    const aiDiv = appendMessage("", 'ai-message');
    let i = 0;
    const speed = 20; // Әр әріптің жылдамдығы

    function type() {
        if (i < text.length) {
            aiDiv.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }
    type();
}

// Оқиғаларды тыңдау
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
