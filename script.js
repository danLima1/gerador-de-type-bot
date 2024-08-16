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
                // Atualizar avatar, nome e status
                document.getElementById('avatar').src = data.avatar;
                document.getElementById('display-name').textContent = data.displayName;
                document.getElementById('status').textContent = data.status;
                
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

        if (currentMessage.type === 'email' || currentMessage.type === 'condicao') {
            // Não incrementa o índice aqui; esperar a interação do usuário
            if (currentMessage.type === 'email') {
                showEmailPrompt(currentMessage);
            } else if (currentMessage.type === 'condicao') {
                showInputPrompt(currentMessage.condition);
            }
        } else {
            displayMessage(currentMessage);
            messageIndex++;
            setTimeout(showNextMessage, 2000);
        }
    } else {
        console.log("Fim da conversa do typebot.");
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

    scrollToBottom();
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

function handleUserInput(userInput, condition) {
    displayUserMessage(userInput);

    if (userInput === condition) {
        const matchingMessage = messages.find(message => message.condition === condition);

        if (matchingMessage) {
            setTimeout(() => {
                displayMessage(matchingMessage);
                messageIndex++; // Move para a próxima mensagem
                setTimeout(showNextMessage, 2000); // Aguardar 2 segundos antes de exibir a próxima mensagem
            }, 2000);
        } else {
            console.error("Mensagem para condição não encontrada.");
        }
    } else {
        console.error("Condição não satisfeita.");
    }
}

function displayUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'message typebot-user-bubble'; // Estilo para a mensagem do usuário

    const messageText = document.createElement('div');
    messageText.className = 'bubble-typing';
    messageText.textContent = message;

    userMessage.appendChild(messageText);
    document.querySelector('.chat-box').appendChild(userMessage);
    scrollToBottom();
}

function scrollToBottom() {
    const chatBox = document.querySelector('.chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}
