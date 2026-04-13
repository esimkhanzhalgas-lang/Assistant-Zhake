// Сұраныс санауышы үшін айнымалы
let count = 0;

// 1. Қараңғы тақырыпты ауыстыру функциясы
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// 2. ЖИ-ге сұраныс жіберу және санауышты жаңарту
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const counterDisplay = document.getElementById('counter');

sendBtn.addEventListener('click', () => {
    const text = userInput.value;
    if (text.trim() !== "") {
        // Санауышты арттыру
        count++;
        counterDisplay.innerText = count;

        // Пайдаланушының сұрағын чатқа шығару
        chatWindow.innerHTML += <p><b>Сен:</b> ${text}</p>;
        
        // ЖИ жауабының имитациясы (API кілтінсіз тесттік нұсқа)
        setTimeout(() => {
            chatWindow.innerHTML += <p><b>ЖИ:</b> Мен бұл сұрақты өңдеп жатырмын...</p>;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 500);

        userInput.value = ""; // Енгізу өрісін тазарту
    }
});
