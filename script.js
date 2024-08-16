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
        typebotAvatar = data.avatar;
        document.getElementById('avatar').src = data.avatar;
        document.getElementById('display-name').textContent = data.displayName;
        document.getElementById('status').textContent = data.status || 'Online';
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

function displayResponseButton(message) {
  const button = document.createElement("button");
  button.className = "response-button";
  button.textContent = message.button_label;

  const userMessage = document.createElement("div");
  userMessage.className = "message typebot-user-bubble";
  userMessage.appendChild(button);
  document.querySelector(".chat-box").appendChild(userMessage);

  button.addEventListener("click", () => {
    displayUserMessage(message.button_label);
    button.remove();
    displayMessage({ text: message.button_response }); 
    messageIndex++;
    showNextMessage();
  });

  scrollToBottom();
}

function displayMessage(message) {
  if (message.buttonLabel) {
    displayResponseButton(message);
    return;
  } 

  if (message.redirectText) {
    const linkElement = document.createElement("a");
    linkElement.href = message.redirectLink;
    linkElement.target = "_blank";
    linkElement.textContent = message.redirectText;
    const messageElement = document.createElement('div');
    messageElement.className = 'message typebot-host-bubble'; 
    messageElement.appendChild(linkElement);
    document.querySelector('.chat-box').appendChild(messageElement);
    scrollToBottom();
    messageIndex++; 
    showNextMessage();
    return;
  } 

  const typingBubble = document.createElement('div');
  typingBubble.className = 'bubble-typing';
  typingBubble.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  const typingElement = document.createElement('div');
  typingElement.className = 'message typebot-host-bubble typing';
  typingElement.appendChild(typingBubble);
  document.querySelector('.chat-box').appendChild(typingElement);

  scrollToBottom();

  setTimeout(() => {
    typingElement.remove();
    const messageElement = document.createElement('div');
    messageElement.className = 'message typebot-host-bubble';
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    const img = document.createElement('img');
    img.src = typebotAvatar;
    img.onload = function () {
      avatar.appendChild(img);
    };
    img.onerror = function () {
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
}
function showInputPrompt(condition) {
  const inputContainer = document.createElement('div');
  inputContainer.className = 'message typebot-guest-bubble input-container';

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'Digite sua resposta...';
  inputField.required = true;

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