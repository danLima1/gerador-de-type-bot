document.getElementById('add-message').addEventListener('click', function () {
    addMessageEntry(false);
});

document.getElementById('add-input-condition').addEventListener('click', function () {
    addMessageEntry(true);
});

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
        conditionInput.className = 'condition-input';  // Adicionei uma classe para identificar inputs de condição
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

document.getElementById('typebot-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const typebotName = document.getElementById('typebot-name').value;
    const messageEntries = document.querySelectorAll('.message-entry');
    
    const messages = Array.from(messageEntries).map(entry => {
        return {
            text: entry.querySelector('textarea').value,
            image: entry.querySelector('input[type="file"]').files[0],
            condition: entry.querySelector('.condition-input') ? entry.querySelector('.condition-input').value : null
        };
    });
    
    const formData = new FormData();
    formData.append('name', typebotName);
    messages.forEach((message, index) => {
        formData.append(`messages[${index}][text]`, message.text);
        if (message.image) {
            formData.append(`messages[${index}][image]`, message.image);
        }
        if (message.condition) {
            formData.append(`messages[${index}][condition]`, message.condition);
        }
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
