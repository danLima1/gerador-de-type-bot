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
<<<<<<< Updated upstream
=======
                typebotAvatar = data.avatar;
                document.getElementById('avatar').src = data.avatar;
                document.getElementById('display-name').textContent = data.displayName;
                document.getElementById('status').textContent = data.status || 'Online';
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
function showNextMessage() {
    if (messageIndex < messages.length) {
        const currentMessage = messages[messageIndex];
=======
function displayMessage(message) {
    const typingBubble = document.createElement('div');
    typingBubble.className = 'bubble-typing';
    typingBubble.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    const typingElement = document.createElement('div');
    typingElement.className = 'message typebot-host-bubble typing';
    typingElement.appendChild(typingBubble);
    document.querySelector('.chat-box').appendChild(typingElement);
>>>>>>> Stashed changes

        setTimeout(() => {
            // Verificar se a mensagem atual tem uma condição e deve mostrar um input
            if (currentMessage.condition) {
                showInputPrompt(currentMessage.condition);
            } else {
                displayMessage(currentMessage);
            }

<<<<<<< Updated upstream
            scrollToBottom();
        }, 2000);
    }
=======
    setTimeout(() => {
        typingElement.remove();

        const messageElement = document.createElement('div');
        messageElement.className = 'message typebot-host-bubble';

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
    
        const img = document.createElement('img');
        img.src = typebotAvatar; 
    
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
        } else if (message.button_label) {
            // Criação do botão clicável
            const button = document.createElement('button');
            // Define a classe do botão
            button.className = 'response-button'; // Classe para estilização
            // Define o texto do botão
            button.textContent = message.button_label;

            // Adiciona o botão ao container do chat como uma mensagem do usuário 
            const userMessage = document.createElement('div');
            userMessage.className = 'message typebot-user-bubble';
            userMessage.appendChild(button);
            document.querySelector('.chat-box').appendChild(userMessage); 

            // Adiciona um event listener ao botão
            button.addEventListener('click', () => {
                // Exibe a resposta associada ao botão na tela do chat
                displayUserMessage(message.button_label); // Envia o button_label como se o usuário tivesse escrito
                // Exibe a mensagem do bot com a resposta
                displayMessage({text: message.button_response}); // Exibe o button_response como resposta do bot

                // Remove o botão após o clique
                button.remove(); 

            });
        } else {
            messageContent.textContent = message.text;
        }
        
        messageElement.appendChild(messageContent);
        document.querySelector('.chat-box').appendChild(messageElement);

        scrollToBottom();

        if (message.type === 'email' || message.type === 'condicao') {
            setTimeout(() => {
                if (message.type === 'email') {
                    showEmailPrompt(message);
                } else if (message.type === 'condicao') {
                    showInputPrompt(message.condition);
                }
            }, 2000);
        }
    }, 1000);
>>>>>>> Stashed changes
}

function showInputPrompt(condition) {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'message typebot-guest-bubble input-container';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Digite sua resposta...';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Enviar';
    submitButton.addEventListener('click', () => {
        const userInput = inputField.value.trim();
        if (userInput) {
            displayUserMessage(userInput);

            inputContainer.remove();

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

<<<<<<< Updated upstream
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
=======
function showEmailPrompt(message) {
    const emailContainer = document.createElement('div');
    emailContainer.className = 'message typebot-guest-bubble input-container'; 

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'styled-input'; 
    emailInput.placeholder = message.email_label || 'Seu Email';
    emailInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.className = 'styled-button'; 
    submitButton.textContent = 'Enviar';
    submitButton.addEventListener('click', () => {
        const userEmail = emailInput.value.trim();

        if (isValidEmail(userEmail)) {
            displayUserMessage(userEmail);

            emailContainer.remove();

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
>>>>>>> Stashed changes

    messageIndex++;
    showNextMessage();
}

function scrollToBottom() {
    const chatBox = document.querySelector('.chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}