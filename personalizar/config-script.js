document.getElementById('add-message').addEventListener('click', function () {
    addMessageEntry(false);
});

document.getElementById('add-input-condition').addEventListener('click', function () {
    addMessageEntry(true);
});

<<<<<<< Updated upstream
=======
document.getElementById('add-email-message').addEventListener('click', function() {
    addEmailMessageEntry();
});

document.getElementById('add-response-button').addEventListener('click', function () {
    addResponseButtonEntry();
});

>>>>>>> Stashed changes
function addMessageEntry(isConditional) {
    const messagesContainer = document.getElementById('messages-container');
    
    const messageEntry = document.createElement('div');
    messageEntry.className = 'message-entry';
    
    if (isConditional) {
        const conditionLabel = document.createElement('label');
        conditionLabel.textContent = 'Condição (se o usuário digitar):';
        const conditionInput = document.createElement('input');
        conditionInput.type = 'text';
        conditionInput.placeholder = 'Exemplo: 1';
<<<<<<< Updated upstream
        conditionInput.className = 'condition-input';  // Adicionei uma classe para identificar inputs de condição
=======
        conditionInput.className = 'condition-input';  
        conditionInput.dataset.type = "condicao";  
>>>>>>> Stashed changes
        messageEntry.appendChild(conditionLabel);
        messageEntry.appendChild(conditionInput);
    }
    
    const messageLabel = document.createElement('label');
    messageLabel.textContent = 'Mensagem:';
    
    const messageInput = document.createElement('textarea');
    messageInput.placeholder = 'Digite sua mensagem aqui...';
    messageInput.rows = 2;
    
    const imageLabel = document.createElement('label');
    imageLabel.textContent = 'Imagem (opcional):';
    
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    
    messageEntry.appendChild(messageLabel);
    messageEntry.appendChild(messageInput);
    messageEntry.appendChild(imageLabel);
    messageEntry.appendChild(imageInput);
    
    messagesContainer.appendChild(messageEntry);
}

function addEmailMessageEntry() {
    const messagesContainer = document.getElementById('messages-container');

    const messageEntry = document.createElement('div');
    messageEntry.className = 'message-entry';

    const messageLabel = document.createElement('label');
    messageLabel.textContent = 'Mensagem:';

    const messageInput = document.createElement('textarea');
    messageInput.placeholder = 'Digite a mensagem solicitando o email (ex: Digite seu email: )';
    messageInput.rows = 1;

    const emailInputLabel = document.createElement('label');
    emailInputLabel.textContent = 'Label do Campo Email (opcional):'; 

    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.placeholder = 'Label do Campo (opcional - deixe em branco para o padrão)';
    emailInput.className = 'email-label'; 
    emailInput.dataset.type = 'email'; 

    const emailValidationLabel = document.createElement('label');
    emailValidationLabel.textContent = 'Validação do Email:'; 

    const emailValidationMessage = document.createElement('textarea');
    emailValidationMessage.placeholder = 'Mensagem a ser exibida em caso de erro (ex: Email inválido. Por favor, tente novamente.)';
    emailValidationMessage.rows = 1;
    emailValidationMessage.className = 'email-validation'; 

    messageEntry.appendChild(messageLabel);
    messageEntry.appendChild(messageInput);
    messageEntry.appendChild(emailInputLabel);
    messageEntry.appendChild(emailInput);
    messageEntry.appendChild(emailValidationLabel);
    messageEntry.appendChild(emailValidationMessage);

    messagesContainer.appendChild(messageEntry);
}

function addResponseButtonEntry() {
    const messagesContainer = document.getElementById('messages-container');

    const responseEntry = document.createElement('div');
    responseEntry.className = 'message-entry';

    const buttonTextLabel = document.createElement('label');
    buttonTextLabel.textContent = 'Texto do Botão:';

    const buttonInput = document.createElement('input');
    buttonInput.type = 'text'; 
    buttonInput.className = 'button-label'; 
    buttonInput.placeholder = 'Texto do Botão'; 
    buttonInput.dataset.type = 'button'; 

    const responseLabel = document.createElement('label');
    responseLabel.textContent = 'Resposta Associada:';

    const responseText = document.createElement('textarea');
    responseText.placeholder = 'Digite a resposta associada ao botão...';
    responseText.rows = 2;
    responseText.className = 'response-text'; 
    responseText.dataset.type = 'response';  

    responseEntry.appendChild(buttonTextLabel);
    responseEntry.appendChild(buttonInput);
    responseEntry.appendChild(responseLabel);
    responseEntry.appendChild(responseText);

    messagesContainer.appendChild(responseEntry);
}

document.getElementById('typebot-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const typebotName = document.getElementById('typebot-name').value;
    const messageEntries = document.querySelectorAll('.message-entry');
    
    const messages = Array.from(messageEntries).map(entry => {
<<<<<<< Updated upstream
        return {
            text: entry.querySelector('textarea').value,
            image: entry.querySelector('input[type="file"]').files[0],
            condition: entry.querySelector('.condition-input') ? entry.querySelector('.condition-input').value : null
=======
        const text = entry.querySelector('textarea') ? entry.querySelector('textarea').value : null;
        const imageInput = entry.querySelector('input[type="file"]');
        const image = imageInput ? imageInput.files[0] : null;
        const condition = entry.querySelector('.condition-input') ? entry.querySelector('.condition-input').value : null;
        const emailLabel = entry.querySelector('.email-label') ? entry.querySelector('.email-label').value : null;
        const validationMessage = entry.querySelector('.email-validation') ? entry.querySelector('.email-validation').value : null;
        const buttonLabel = entry.querySelector('.button-label') ? entry.querySelector('.button-label').value : null;
        const buttonResponse = entry.querySelector('.response-text') ? entry.querySelector('.response-text').value : null;
        const type = entry.querySelector('[data-type]') ? entry.querySelector('[data-type]').dataset.type : null;

        return {
            text: text,
            image: image,
            condition: condition,
            validationMessage: validationMessage,
            emailLabel: emailLabel,
            buttonLabel: buttonLabel,
            buttonResponse: buttonResponse,
            type: type
>>>>>>> Stashed changes
        };
    });
    
    const formData = new FormData();
    formData.append('name', typebotName);
    messages.forEach((message, index) => {
<<<<<<< Updated upstream
        formData.append(`messages[${index}][text]`, message.text);
=======
        formData.append(`messages[${index}][text]`, message.text || '');
        formData.append(`messages[${index}][email_label]`, message.emailLabel || '');
>>>>>>> Stashed changes
        if (message.image) {
            formData.append(`messages[${index}][image]`, message.image);
        }
        if (message.condition) {
            formData.append(`messages[${index}][condition]`, message.condition || '');
        }
<<<<<<< Updated upstream
=======
        if (message.validationMessage) {
            formData.append(`messages[${index}][validationMessage]`, message.validationMessage || '');
        }
        if (message.type) {
            formData.append(`messages[${index}][type]`, message.type || '');
        }
        if (message.buttonLabel) {
            formData.append(`messages[${index}][buttonLabel]`, message.buttonLabel || '');
        }
        if (message.buttonResponse) {
            formData.append(`messages[${index}][buttonResponse]`, message.buttonResponse || '');
        }
>>>>>>> Stashed changes
    });
    
    fetch('http://localhost:5000/create_typebot', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          alert('Typebot salvo com sucesso! ID do Typebot: ' + data.typebot_id);
          document.getElementById('typebot-id-display').textContent = 'ID do Typebot: ' + data.typebot_id;
      }).catch(error => {
          console.error('Erro:', error);
          alert('Erro ao salvar o Typebot.');
      });
});