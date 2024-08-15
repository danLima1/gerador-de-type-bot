let messageIndex = 0;
let messages = [];
let typebotId;

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

function showNextMessage() {
    if (messageIndex < messages.length) {
        const currentMessage = messages[messageIndex];

        setTimeout(() => {
            // Verificar se a mensagem atual tem uma condição e deve mostrar um input
            if (currentMessage.condition) {
                showInputPrompt(currentMessage.condition);
            } else {
                displayMessage(currentMessage);
            }

            scrollToBottom();
        }, 2000);
    }
}

function showInputPrompt(condition) {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'message typebot-guest-bubble';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Digite sua resposta...';

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

function handleUserInput(userInput, condition) {
    const matchingMessage = messages.find(message => message.condition === condition);
    if (matchingMessage && userInput === condition) {
        displayMessage(matchingMessage);
    } else {
        showNextMessage();
    }
}

function displayMessage(message) {
    const typingBubble = document.createElement('div');
    typingBubble.className = 'bubble-typing';

    if (message.image_path) {
        const img = document.createElement("img");
        img.src = message.image_path;
        img.alt = "Imagem";
        typingBubble.appendChild(img);
    } else {
        typingBubble.textContent = message.text;
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'message typebot-host-bubble';
    messageElement.appendChild(typingBubble);
    document.querySelector('.chat-box').appendChild(messageElement);

    messageIndex++;
    showNextMessage();
}

function scrollToBottom() {
    const chatBox = document.querySelector('.chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}