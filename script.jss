document.getElementById('send-btn').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const input = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    
    if (input.value.trim() === "") return;

    // 1. Пайдаланушының хабарламасын қосу
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.textContent = input.value;
    chatWindow.appendChild(userDiv);

    const userText = input.value.toLowerCase();
    input.value = ""; // Мәтінді тазалау

    // 2. ЖИ жауабын имитациялау (Кідіріспен)
    setTimeout(() => {
        const aiDiv = document.createElement('div');
        aiDiv.className = 'message ai-message';
        
        // Қарапайым логикалық жауаптар
        if (userText.includes("сәлем")) {
            aiDiv.textContent = "Сәлем! Сізге қалай көмектесе аламын?";
        } else if (userText.includes("кімсің")) {
            aiDiv.textContent = "Мен Zhake-нің алғашқы ЖИ ассистентімін!";
        } else if (userText.includes("код")) {
            aiDiv.textContent = "Код жазу — бұл өнер. Қандай тілде көмек керек?";
        } else {
            aiDiv.textContent = "Бұл өте қызықты сұрақ! Мен әлі үйреніп жатырмын.";
        }
        
        chatWindow.appendChild(aiDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Төменге автоматты айналдыру
    }, 1000);
}
