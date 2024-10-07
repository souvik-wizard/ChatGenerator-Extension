export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  main() {
    let modalOpen = false;
    // To check if the icon inside Message field is clicked
    let iconClicked = false;
    // To store the user's prompt
    let userPrompt = ''; 

    document.addEventListener('focusin', (e) => {
      const messageInput = document.querySelector('.msg-form__contenteditable');
      const inputParent = messageInput?.parentElement?.parentElement;

      if (e.target === messageInput && inputParent) {
        showIcon(inputParent);
      }
    });

    document.addEventListener('focusout', () => {
      if (!iconClicked) hideIcon();
      iconClicked = false;
    });

    function showIcon(inputParent: Element) {
      if (document.getElementById('response-generator-icon')) return;

      const icon = document.createElement('div');
      icon.id = 'response-generator-icon';
      icon.style.cssText = `
        background-color: white;
        border-radius: 100%;
        padding: 4px;
        right: 4px;
        bottom: 4px;
        position: absolute;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      `;

      const img = document.createElement('img');
      img.alt = 'Response Generator Icon';
      img.src = "https://i.imgur.com/fr8ZytJ.png"; 
      img.style.cssText = `
        width: 20px;
        padding: 2px;
      `;

      icon.appendChild(img);
      inputParent.appendChild(icon);

      icon.addEventListener('mousedown', (e) => {
        e.preventDefault();
        iconClicked = true;
      });

      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        iconClicked = true;
        if (!modalOpen) {
          modalOpen = true;
          openModal();
        }
      });
    }

    function hideIcon() {
      const icon = document.getElementById('response-generator-icon');
      if (icon) icon.remove();
    }

    function openModal() {
      const modal = document.createElement('div');
      modal.id = 'response-generator-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;
    
      const modalContent = document.createElement('div');
      modalContent.id = 'modal-content';
      modalContent.style.cssText = `
        background-color: #F9FAFB;
        padding: 20px;
        border-radius: 8px;
        width: 580px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        position: relative;
        display: flex;
        flex-direction: column;
      `;
    
      // First slide (input area and button)
      const inputField = document.createElement('input');
      inputField.type = 'text';
      inputField.placeholder = 'Your prompt';
      inputField.style.cssText = `
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #C1C7D0;
        border-radius: 4px;
        outline: none;
        box-shadow: none !important;
        color: #666D80;
      `;
    // Warning message for empty input
      const warningMessage = document.createElement('div');
      warningMessage.innerText = 'Prompt cannot be empty!';
      warningMessage.style.cssText = `
        color: red;
        font-size: 14px;
        margin-top: 5px;
        display: none; /* Initially hidden */
      `;
    
      const generateButton = document.createElement('button');
      generateButton.innerText = 'Generate';
      generateButton.style.cssText = `
        padding: 10px 15px;
        background-color: #3B82F6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        align-self: flex-end;
      `;
    
      generateButton.addEventListener('click', () => {
        // Trim whitespace (edge case)
        userPrompt = inputField.value.trim(); 
        // Check if the trimmed input is empty
        if (!userPrompt) {
          warningMessage.style.display = 'block'; 
          return; 
        } else {
          warningMessage.style.display = 'none'; 
        }
    
        showSecondSlide(modalContent);
      });
    
      modalContent.appendChild(inputField);
      modalContent.appendChild(warningMessage); 
      modalContent.appendChild(generateButton);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
    
      modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
      });
    }
    

    // Function to create a button with text and icon
    function createButton(text: string, iconUrl: string) {
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
        cursor: pointer;
      `;
    
      const button = document.createElement('button');
      button.style.cssText = `
        padding: 10px 15px;
        background-color: #3B82F6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px; /* Space between text and icon */
      `;
    
      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = `${text} Icon`;
      img.style.cssText = `
        width: 12px;
      `;
    
      // Append the icon first, then the text
      button.appendChild(img);
      button.appendChild(document.createTextNode(text));
      buttonContainer.appendChild(button);
    
      return buttonContainer;
    }
    
    //Second slide of the modal
    function showSecondSlide(modalContent: HTMLElement) {
      modalContent.innerHTML = '';

      const promptWrapper = document.createElement('div');
      promptWrapper.style.cssText = `
        display: flex;
        justify-content: flex-end; 
        width: 100%;
        margin-bottom: 20px;
      `;

      //Previously given Prompt display
      const promptDisplay = document.createElement('div');
      promptDisplay.innerText = `${userPrompt}`;
      promptDisplay.style.cssText = `
        text-align: left;
        min-width: 20%;
        background-color: #DFE1E7;
        margin-bottom: 10px;
        color: #666D80;
        border-radius: 6px;
        padding: 10px;
      `;

      promptWrapper.appendChild(promptDisplay);

      const responseText = 'Thank you for the opportunity! If you have any more questions or if there\'s anything else I can help you with, feel free to ask.';

      // Response for given prompt display
      const responseDisplay = document.createElement('div');
      responseDisplay.innerText = responseText;
      responseDisplay.style.cssText = `
        width: 80%;
        text-align: left;
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 6px;
        background-color: #DBEAFE;
        color: #666D80;
      `;

      // Second input field for additional prompt
      const secondInputField = document.createElement('input');
      secondInputField.type = 'text';
      secondInputField.placeholder = 'Your prompt';
      secondInputField.style.cssText = `
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #C1C7D0;
        border-radius: 4px;
        outline: none;
        box-shadow: none !important;
        color: #666D80;
      `;

      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      `;

      // Regenerate button
      const regenerateButton = createButton('Regenerate', 'https://i.imgur.com/tPTpN8Y.png');

      // Insert button
      const insertButton = createButton('Insert', 'https://i.imgur.com/G2BNjtp.png');
      insertButton.querySelector('button')!.style.cssText += `
        background-color: transparent;
        color: #666D80;
        border: 1px solid #666D80;
      `;

      insertButton.addEventListener('click', () => {
        const messageInput = document.querySelector('.msg-form__contenteditable')?.children[0] as HTMLElement;

        if (messageInput) {
          messageInput.innerHTML += responseText;

          // Trigger the 'input' event to activate the 'Send' button and remove the placeholder
          const inputEvent = new Event('input', { bubbles: true, cancelable: true });
          messageInput.dispatchEvent(inputEvent);

          hideModal();
        }
      });

      // Append buttons to the button container
      buttonContainer.appendChild(insertButton);
      buttonContainer.appendChild(regenerateButton);

      modalContent.appendChild(promptWrapper);
      modalContent.appendChild(responseDisplay);
      modalContent.appendChild(secondInputField);
      modalContent.appendChild(buttonContainer);
    }

    function hideModal() {
      const modal = document.getElementById('response-generator-modal');
      if (modal) {
        modal.remove();
        modalOpen = false;
      }
    }
  }
});
