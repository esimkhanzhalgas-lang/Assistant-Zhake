<!DOCTYPE html>
<html lang="kk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Әзірлеушіге арналған ЖИ-құралдары</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --primary: #6366f1;
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text: #f8fafc;
            --text-dim: #94a3b8;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 20px;
        }

        .container { max-width: 900px; margin: 0 auto; }

        header { text-align: center; margin-bottom: 50px; }
        header h1 { font-size: 2.5rem; margin-bottom: 10px; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* API Key Input Section */
        .api-config {
            background: rgba(99, 102, 241, 0.1);
            padding: 15px;
            border-radius: 12px;
            border: 1px border var(--primary);
            margin-bottom: 30px;
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .api-config input {
            flex: 1;
            background: #020617;
            border: 1px solid #334155;
            color: white;
            padding: 10px;
            border-radius: 6px;
        }

        /* Chat Window */
        .chat-box {
            background: var(--card-bg);
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #334155;
        }

        #chatMessages {
            height: 450px;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .msg {
            max-width: 80%;
            padding: 12px 18px;
            border-radius: 15px;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .user-msg {
            align-self: flex-end;
            background: var(--primary);
            color: white;
            border-bottom-right-radius: 2px;
        }

        .ai-msg {
            align-self: flex-start;
            background: #334155;
            color: var(--text);
            border-bottom-left-radius: 2px;
        }

        .input-area {
            display: flex;
            padding: 20px;
            background: #1e293b;
            border-top: 1px solid #334155;
            gap: 10px;
        }

        .input-area input {
            flex: 1;
            background: #0f172a;
            border: 1px solid #334155;
            color: white;
            padding: 12px;
            border-radius: 10px;
            outline: none;
        }

        .input-area button {
            background: var(--primary);
            color: white;
            border: none;
            padding: 0 20px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: 0.2s;
        }

        .input-area button:hover { opacity: 0.9; transform: translateY(-1px); }

        .stats { margin-top: 20px; color: var(--text-dim); text-align: right; font-size: 0.8rem; }
    </style>
</head>
<body>

<div class="container">
    <header>
        <h1><i class="fas fa-bolt"></i> OpenAI Ассистент</h1>
        <p>Веб-бетке біріктірілген ЖИ</p>
    </header>

    <div class="api-config">
        <i class="fas fa-key" style="color: var(--primary)"></i>
        <input type="password" id="apiKey" placeholder="OpenAI API кілтін осында қойыңыз (sk-...)">
    </div>

    <main class="chat-box">
        <div id="chatMessages">
            <div class="msg ai-msg">Сәлем! OpenAI API кілтін жоғарыға қойып, маған кез келген сұрақ қойыңыз.</div>
        </div>
        <div class="input-area">
            <input type="text" id="userInput" placeholder="Хабарлама жазу...">
            <button id="sendBtn">Жіберу <i class="fas fa-paper-plane"></i></button>
        </div>
    </main>

    <div class="stats">
        Сұраныстар: <span id="reqCount">0</span> | Модель: gpt-3.5-turbo
    </div>
</div>

<script>
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const apiKeyInput = document.getElementById('apiKey');
    const reqCountDisplay = document.getElementById('reqCount');
    
    let count = 0;

    async function handleSend() {
        const key = apiKeyInput.value.trim();
        const text = userInput.value.trim();

        if (!key) {
            alert("Өтініш, алдымен API кілтті енгізіңіз!");
            return;
        }
        if (!text) return;

        // Пайдаланушы хабарламасын қосу
        addMessage(text, 'user-msg');
        userInput.value = '';

        // Жүктеу индикаторы
        const loadingMsg = addMessage('ЖИ ойланып жатыр...', 'ai-msg');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: text }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            loadingMsg.remove();

            if (data.error) {
                addMessage("Қате: " + data.error.message, 'ai-msg');
            } else {
                const aiText = data.choices[0].message.content;
                addMessage(aiText, 'ai-msg');
                count++;
                reqCountDisplay.innerText = count;
            }

        } catch (error) {
            loadingMsg.remove();
            addMessage("Сервермен байланыс үзілді. Кілтті немесе интернетті тексеріңіз.", 'ai-msg');
        }
    }

    function addMessage(text, className) {
        const div = document.createElement('div');
        div.className = `msg ${className}`;
        div.innerText = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return div;
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
</script>

</body>
</html>
