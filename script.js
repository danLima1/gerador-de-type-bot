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
        document.getElementById('display-name').textContent = data.displayName + ' '; 
        const iconeVerificado = document.createElement('i');
        iconeVerificado.className = 'fas fa-check-circle'; 
        document.getElementById('display-name').appendChild(iconeVerificado); 
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

function updateStatus(isTyping) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = isTyping ? 'Digitando...' : 'Online';
}

function displayResponseButtons(message) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  const buttonGroupId = message.buttonGroupId;
  const buttonsInGroup = messages.filter(msg => msg.buttonGroupId === buttonGroupId && msg.button_label);
  document.querySelectorAll(".button-container").forEach(container => container.remove());
  buttonsInGroup.forEach((msg) => {
    const button = document.createElement("button");
    button.className = "response-button";
    button.textContent = msg.button_label;
    button.addEventListener("click", () => {
      displayUserMessage(msg.button_label);
      buttonContainer.remove();
      displayMessage({ text: msg.button_response });
      messageIndex++;
      showNextMessage();
    });
    buttonContainer.appendChild(button);
  });
  document.querySelector(".chat-box").appendChild(buttonContainer);
  scrollToBottom();
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

    const allButtons = document.querySelectorAll(".response-button");
    allButtons.forEach(btn => btn.remove());

    displayMessage({ text: message.button_response });
    messageIndex++;
    showNextMessage();
  });
  scrollToBottom();
}

function displayMessage(message) {
  updateStatus(true);

  if (message.buttonGroupId) {
    displayResponseButtons(message);
    updateStatus(false);
    return;
  }

  if (message.button_label) {
    displayResponseButton(message);
    updateStatus(false);
    return;
  }

  if (message.ratingMessage) {
    displayStarRating(message);
    updateStatus(false);
    return;
  }

  if (message.redirectLink) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message typebot-host-bubble';
    const messageContent = document.createElement('div');
    messageContent.className = 'bubble-content';
    messageContent.textContent = message.redirectMessage || "Redirecionando em breve...";
    messageElement.appendChild(messageContent);
    document.querySelector('.chat-box').appendChild(messageElement);
    scrollToBottom();

    setTimeout(() => {
      window.location.href = message.redirectLink;
    }, 2000);

    return;
  }

  if (!message.image_path && !message.ratingMessage && !message.redirectLink) {
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
      updateStatus(false);

      if (message.type === 'email') {
        setTimeout(() => {
          showEmailPrompt(message);
        }, 2000);
      } else if (message.type === 'condicao') {
        setTimeout(() => {
          showInputPrompt(message.condition);
        }, 2000);
      }
    }, 1000);
  } else { 
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
    updateStatus(false);
  }
}


function displayStarRating(message) {
  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'rating-container';

  const messageContent = document.createElement('div');
  messageContent.className = 'rating-message';
  messageContent.textContent = message.text;

  ratingContainer.appendChild(messageContent);

  const starsContainer = document.createElement('div');
  starsContainer.className = 'stars-container';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('i');
    star.className = 'fa-regular fa-star';
    star.dataset.ratingValue = i;
    star.addEventListener('click', () => {
      const ratingValue = star.dataset.ratingValue;
      displayUserMessage(`${ratingValue}`);
      ratingContainer.remove();
      setTimeout(() => {
        displayMessage({ text: message.ratingMessage });
        setTimeout(() => {
          messageIndex++;
          showNextMessage();
        }, 1700);
      }, 500);
    });

    starsContainer.appendChild(star);
  }
  ratingContainer.appendChild(starsContainer);
  document.querySelector('.chat-box').appendChild(ratingContainer);
  scrollToBottom();
}

function showInputPrompt(condition) {
  const inputContainer = document.createElement('div');
  inputContainer.className = 'message typebot-user-bubble input-container';

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'Digite sua resposta...';
  inputField.required = true;
  inputField.className = 'styled-input';
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Enviar';
  submitButton.className = 'styled-button';
  const sendInput = () => {
    const userInput = inputField.value.trim();
    if (userInput) {
      inputContainer.remove();
      handleUserInput(userInput, condition);
    } else {
      alert('Por favor, insira uma resposta.');
    }
  };

  submitButton.addEventListener('click', sendInput);
  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendInput();
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
    if (currentMessage.ratingMessage) {
      displayStarRating(currentMessage);
    } else {
      displayMessage(currentMessage);
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
  const sendEmail = () => {
    const userEmail = emailInput.value.trim();
    if (isValidEmail(userEmail)) {
      displayUserMessage(userEmail);
      emailContainer.remove();
      handleEmailInput(userEmail, message);
    } else {
      alert(message.validationMessage || 'Por favor, digite um email válido.');
      emailInput.focus();
    }
  };

  submitButton.addEventListener('click', sendEmail);
  emailInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendEmail();
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
      const nextValidMessageIndex = messageIndex + 1; 
      messageIndex = nextValidMessageIndex;
      setTimeout(() => {
        displayMessage(matchingMessage); 
        showNextMessage(); 
      }, 2000); 
    } else {
      console.error("Mensagem para condição não encontrada.");
    }
  } else {
    displayUserMessage(userInput);
    messageIndex++; 
    showNextMessage(); 
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