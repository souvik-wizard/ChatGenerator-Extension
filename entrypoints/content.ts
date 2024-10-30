export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  main() {
    let modalOpen = false;
    let iconClicked = false;
    let userPrompt = ''; 
    let regeneratePrompt = '';
    let responseText = '';
    const htmlElem =  document.getElementsByTagName('html')[0];
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

    const fetchResponse = async (prompt: string): Promise<string> => {
      // Enter your API key here
      const apiKey = "ENTER YOUR API KEY HERE";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      };
    
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const jsonData = await response.json();
        const responseData = jsonData.candidates[0].content.parts[0].text;
        return responseData;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

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
        gap: 5px;
      `;

      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = `${text} Icon`;
      img.style.cssText = `
        width: 12px;
      `;

      button.appendChild(img);
      button.appendChild(document.createTextNode(text));
      buttonContainer.appendChild(button);

      return buttonContainer;
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

      const style = document.createElement('style');
      document.head.appendChild(style);

      function setPlaceholderColor(condition: boolean) {
        const placeholderColor = condition ? '#666D80' : '#666D80';
        style.innerHTML = `
          input::placeholder {
            color: ${placeholderColor} !important;
          }
        `;
      } 
      const someCondition = htmlElem.className.includes('theme--dark'); 
      setPlaceholderColor(someCondition);

      const warningMessage = document.createElement('div');
      warningMessage.innerText = 'Please enter something!';
      warningMessage.style.cssText = `
        color: red;
        font-size: 14px;
        margin-top: 5px;
        display: none;
      `;

      const generateButton = createButton('Generate', "https://i.imgur.com/px7bqu7.png");
      generateButton.addEventListener('click', () => {
        userPrompt = inputField.value.trim();
        const generateResponseContent =  `Generate a response as per this prompt "${userPrompt}" for Linkedin. And most important, whatever the prompt is try to find familiarity with Linkedin context and respond accordingly also do not add any special characters because I'm going to copy and paste the response.`;
        // console.log(userPrompt, 'userPrompt from generate button');
        if (!userPrompt) {
          warningMessage.style.display = 'block'; 
          return;
        } else {
          warningMessage.style.display = 'none'; 
          fetchResponse(generateResponseContent).then((responseData) => {  
            responseText = responseData;
            showSecondSlide(modalContent);
          });
        }
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

    function showSecondSlide(modalContent: HTMLElement) {
      modalContent.innerHTML = '';

      const promptWrapper = document.createElement('div');
      promptWrapper.style.cssText = `
        display: flex;
        justify-content: flex-end; 
        width: 100%;
        margin-bottom: 20px;
      `;

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

      const responseDisplay = document.createElement('div');
      responseDisplay.innerText = responseText;
      responseDisplay.style.cssText = `
        width: 80%;
        max-height: 120px;
        overflow-y: auto;
        text-align: left;
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 6px;
        background-color: #DBEAFE;
        color: #666D80;
      `;
      // Second input field for additional prompt
      const secondInputFieldTitle = document.createElement('p');
      secondInputFieldTitle.innerText = 'Would you like to add something to your previous prompt?';
      secondInputFieldTitle.style.cssText = `
        color: #666D80;
        font-size: 14px;
        margin-bottom: 5px;
        margin-top: 10px
      `;
      
      const secondInputField = document.createElement('input');
      secondInputField.type = 'text';
      secondInputField.placeholder = 'Additional prompt';
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
      const warningMessage = document.createElement('div');
      warningMessage.innerText = "Please enter something that you would like to add to your previous prompt!";
      warningMessage.style.cssText = `
        color: red;
        font-size: 14px;
        margin-top: 5px;
        display: none;
        margin-bottom: 10px;
      `;

      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      `;

      const regenerateButton = createButton('Regenerate', 'https://i.imgur.com/tPTpN8Y.png');
      regenerateButton.addEventListener('click', () => {
        regeneratePrompt = secondInputField.value.trim();
        // console.log(regeneratePrompt, 'from regenerate button');
        const regenerateResponseContent = `Give me a better response(1 response only) then this for Linkedin: " ${responseText}" and also consider this "${regeneratePrompt}" while generating the response. Also do not add any special characters because I'm gonna copy and paste the response.`;
        // console.log(regenerateResponseContent);
        if (!regeneratePrompt){
          warningMessage.style.display = 'block';
          return;
        }else{
          warningMessage.style.display = 'none';
          fetchResponse(regenerateResponseContent).then((newResponse) => {
            responseText = newResponse; 
            responseDisplay.innerText = responseText;
          });
        }
      });

      const insertButton = createButton('Insert', 'https://i.imgur.com/G2BNjtp.png');
      insertButton.querySelector('button')!.style.cssText += `
      background-color: transparent;
      color: #666D80;
      border: 1px solid #666D80;
    `;
      insertButton.querySelector('button')?.addEventListener('click', () => {
        const input = document.querySelector('.msg-form__contenteditable')?.children[0] as HTMLElement;;
        if (input && responseText) {
          input.innerHTML = responseText;
          const inputEvent = new Event('input', { bubbles: true, cancelable: true });
          input.dispatchEvent(inputEvent);
        }
        hideModal();
      });

      buttonContainer.appendChild(insertButton);
      buttonContainer.appendChild(regenerateButton);

      modalContent.appendChild(promptWrapper);
      modalContent.appendChild(responseDisplay);
      modalContent.appendChild(secondInputFieldTitle);
      modalContent.appendChild(secondInputField);
      modalContent.appendChild(warningMessage);
      modalContent.appendChild(buttonContainer);
    }

    function hideModal() {
      modalOpen = false;
      const modal = document.getElementById('response-generator-modal');
      if (modal) modal.remove();
    }
  }
});
