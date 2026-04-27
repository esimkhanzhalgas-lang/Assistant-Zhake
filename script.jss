// 3-тапсырма: API арқылы чат
const API_KEY = "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";
let requestCount = 0;

/**
 * Хабарлама жіберу функциясы
 */
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const display = document.getElementById('chatMessages');
    const counter = document.getElementById('requestCount');

    if (!input.value.trim()) return;

    // Сұраныс санауышы
    requestCount++;
    counter.innerText = requestCount;

    const userText = input.value;
    display.innerHTML += `<div><b>Сен:</b> ${userText}</div>`;
    input.value = "";

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{role: "user", content: userText}]
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content;
        display.innerHTML += `<div style="color: #10a37f"><b>ЖИ:</b> ${aiText}</div>`;
        display.scrollTop = display.scrollHeight;
    } catch (error) {
        display.innerHTML += `<div>Қате: Байланыс үзілді.</div>`;
    }
}

// Тақырыпты ауыстыру
document.getElementById('themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
});

document.getElementById('sendBtn').addEventListener('click', sendMessage);
