const GROQ_KEY = "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";
let count = 0;

/**
 * Хабарлама жіберу және ЖИ-ден жауап алу функциясы
 * @param {string} text - Пайдаланушы енгізген мәтін
 */
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const text = userInput.value.trim();

    if (!text) return;

    // Санауышты арттыру (4-тапсырма)
    count++;
    document.getElementById('requestCount').innerText = count;

    chatBox.innerHTML += `<p><b>Сен:</b> ${text}</p>`;
    userInput.value = "";

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{role: "user", content: text}]
            })
        });
        const data = await response.json();
        const aiMsg = data.choices[0].message.content;
        chatBox.innerHTML += `<p style="color: #6366f1"><b>ЖИ:</b> ${aiMsg}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (e) {
        chatBox.innerHTML += `<p>Қате шықты...</p>`;
    }
}

/**
 * Қараңғы және ашық тақырыпты ауыстыру
 */
document.getElementById('themeToggle').addEventListener('click', () => {
    const body = document.documentElement;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
});

/**
 * Айналдыру кезінде карточкалардың көрінуі (Intersection Observer)
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

document.getElementById('sendBtn').addEventListener('click', sendMessage);
