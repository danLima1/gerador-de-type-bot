let messageIndex = 0;
let messages = [];
let typebotId;
let typebotAvatar;

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    typebotId = urlParams.get('id');

    if (typebotId) {
        fetchMessages(typebotId);
    } else {
        alert('ID do Typebot não encontrado na URL.');
    }
});

function fetchMessages(typebotId) {
    fetch(`http://localhost:5000/get_messages/${typebotId}`)
        .then(response => response.json())
        .then(data => {
            if (data.messages && data.messages.length > 0) {
                typebotAvatar = data.avatar; // Armazena o avatar do Typebot
                document.getElementById('avatar').src = data.avatar;
                document.getElementById('display-name').textContent = data.displayName;
                document.getElementById('status').textContent = data.status || 'Online'; // Padrão: "Online"
                messages = data.messages;
                showNextMessage();
            } else {
                console.error('Nenhuma mensagem encontrada para o Typebot.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar mensagens:', error);
        });
}

function displayMessage(message) {
    // Exibir a animação de digitação antes de mostrar a mensagem
    const typingBubble = document.createElement('div');
    typingBubble.className = 'bubble-typing';
    typingBubble.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    const typingElement = document.createElement('div');
    typingElement.className = 'message typebot-host-bubble typing';
    typingElement.appendChild(typingBubble);
    document.querySelector('.chat-box').appendChild(typingElement);

    scrollToBottom();

    // Aguarde 1 segundo para simular a digitação e então exibir a mensagem
    setTimeout(() => {
        typingElement.remove(); // Remove a animação de digitação

        const messageElement = document.createElement('div');
        messageElement.className = 'message typebot-host-bubble';

        // Adicionar avatar se disponível
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
    
        const img = document.createElement('img');
        img.src = typebotAvatar; // Usa o avatar armazenado
    
        // Verifique se o avatar tem uma URL válida
        img.onload = function() {
            avatar.appendChild(img);
        };
        img.onerror = function() {
            console.error("Erro ao carregar o avatar.");
        };
    
        messageElement.appendChild(avatar);

        const messageContent = document.createElement('div');
        messageContent.className = 'bubble-content';
        if (message.image_path) {
            const img = document.createElement("img");
            img.src = message.image_path;
            img.alt = "Imagem";
            messageContent.appendChild(img);
        } else {
            messageContent.textContent = message.text;
        }
        messageElement.appendChild(messageContent);

        document.querySelector('.chat-box').appendChild(messageElement);

        scrollToBottom();

        // Exibe o input com um atraso de 2 segundos se for um tipo específico
        if (message.type === 'email' || message.type === 'condicao') {
            setTimeout(() => {
                if (message.type === 'email') {
                    showEmailPrompt(message);
                } else if (message.type === 'condicao') {
                    showInputPrompt(message.condition);
                }
            }, 2000);
        }
    }, 1000); // 1 segundo de atraso para a animação de digitação
}

function showInputPrompt(condition) {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'message typebot-guest-bubble';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Digite sua resposta...';
    inputField.required = true;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Enviar';
    submitButton.addEventListener('click', () => {
        const userInput = inputField.value.trim();
        if (userInput) {
            handleUserInput(userInput, condition);
        } else {
            alert('Por favor, insira uma resposta.');
        }
    });

    inputContainer.appendChild(inputField);
    inputContainer.appendChild(submitButton);
    document.querySelector('.chat-box').appendChild(inputContainer);

    scrollToBottom();
}

function showNextMessage() {
    if (messageIndex < messages.length) {
        const currentMessage = messages[messageIndex];
        displayMessage(currentMessage);

        if (currentMessage.type !== 'email' && currentMessage.type !== 'condicao') {
            messageIndex++;
            setTimeout(showNextMessage, 2000);
        }
    } else {
        console.log("Fim da conversa do typebot.");
    }
}

function showEmailPrompt(message) {
    const emailContainer = document.createElement('div');
    emailContainer.className = 'message typebot-guest-bubble input-container'; // Adiciona a classe 'input-container'

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'styled-input'; // Adiciona uma classe para estilização
    emailInput.placeholder = message.email_label || 'Seu Email';
    emailInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.className = 'styled-button'; // Adiciona uma classe para estilização
    submitButton.textContent = 'Enviar';
    submitButton.addEventListener('click', () => {
        const userEmail = emailInput.value.trim();

        if (isValidEmail(userEmail)) {
            handleEmailInput(userEmail, message);
        } else {
            alert(message.validationMessage || 'Por favor, digite um email válido.');
            emailInput.focus();
        }
    });

    emailContainer.appendChild(emailInput);
    emailContainer.appendChild(submitButton);
    document.querySelector('.chat-box').appendChild(emailContainer);

    scrollToBottom();
}

function handleEmailInput(userEmail, message) {
    console.log("Email recebido:", userEmail);

    messageIndex++;
    showNextMessage();
}

function handleUserInput(userInput, condition) {
    if (userInput === condition) {
        const matchingMessage = messages.find(message => message.condition === condition);
        if (matchingMessage) {
            setTimeout(() => {
                displayMessage(matchingMessage);
                showNextMessage();
            }, 2000);
        } else {
            console.error("Mensagem para condição não encontrada.");
        }
    } else {
        displayUserMessage(userInput);
    }
}

function displayUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'message typebot-user-bubble';

    const messageText = document.createElement('div');
    messageText.className = 'bubble-content';
    messageText.textContent = message;

    userMessage.appendChild(messageText);
    document.querySelector('.chat-box').appendChild(userMessage);
    scrollToBottom();
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();

    if (userInput) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message typebot-guest-bubble';

        const messageText = document.createElement('div');
        messageText.className = 'bubble-content';
        messageText.textContent = userInput;

        userMessage.appendChild(messageText);
        document.querySelector('.chat-box').appendChild(userMessage);
        document.getElementById('user-input').value = '';
        scrollToBottom();
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function scrollToBottom() {
    const chatBox = document.querySelector('.chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}
