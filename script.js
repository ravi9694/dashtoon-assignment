let panelCount = 0;

async function query(data) {
  try {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          "Accept": "image/png",
          "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.blob();
    return result;
  } catch (error) {
    throw new Error('Failed to fetch');
  }
}

function generatePanel() {
  if (panelCount >= 10) {
    displayError('You have reached the maximum panel limit (10 panels)');
    return;
  }

  const textInput = document.getElementById('textInput').value.trim();
  document.getElementById('textInput').value = "";

  if (textInput === '') {
    displayError('Please enter text for the panel');
    return;
  }
  panelCount++;

  const panelContainer = document.getElementById('panelContainer');
  const panelDiv = document.createElement('div');
  panelDiv.classList.add('panel');
  
  panelContainer.appendChild(panelDiv);

  const loadingCircle = document.createElement('div');
  loadingCircle.classList.add('loading-circle');
  panelDiv.appendChild(loadingCircle);

  const p = document.createElement('p');
  p.textContent = "Panel No. " + panelCount + ": " + textInput;
  panelDiv.appendChild(p);

  query({ "inputs": textInput }).then((response) => {
    displayPanel(response, textInput, panelDiv);
    clearError();
  }).catch((error) => {
    displayError(error.message);
    panelDiv.remove();
  }).finally(() => {
    loadingCircle.remove();
  });
}

function displayPanel(imageBlob, text, panelDiv) {
  const imageUrl = URL.createObjectURL(imageBlob);
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Generated Panel';

  img.onload = function() {
    panelDiv.appendChild(img);
  };
}

function displayError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
}

function clearError() {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = '';
}
