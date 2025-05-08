function addDownloadButtonToContainer(containerElement) {
  let iconSrc;
  try {
    if (!(chrome && chrome.runtime && chrome.runtime.getURL)) {
      console.warn('Download Assistant: chrome.runtime.getURL is not available.'); return;
    }
    iconSrc = chrome.runtime.getURL('images/icon48.png');
  } catch (e) {
    if (e.message.toLowerCase().includes("extension context invalidated")) {
      console.warn('Download Assistant: Context invalidated.'); return;
    } else {
      console.error('Download Assistant: Error getting icon URL:', e);
      return;
    }
  }

  const downloadIconButton = document.createElement('img');
  downloadIconButton.src = iconSrc;
  downloadIconButton.alt = 'Download sound';
  downloadIconButton.style.width = '24px';
  downloadIconButton.style.height = '24px';
  downloadIconButton.style.verticalAlign = 'middle';
  downloadIconButton.style.marginRight = '5px';

  const downloadTextLabel = document.createElement('span');
  downloadTextLabel.textContent = 'Download';
  downloadTextLabel.style.verticalAlign = 'middle';
  downloadTextLabel.style.fontSize = '12px';

  const downloadButtonContainer = document.createElement('span');
  downloadButtonContainer.style.display = 'inline-flex';
  downloadButtonContainer.style.alignItems = 'center';
  downloadButtonContainer.style.marginLeft = '10px';
  downloadButtonContainer.style.cursor = 'pointer';
  downloadButtonContainer.title = 'Download Audio (Hover to help load source)';
  downloadButtonContainer.style.border = '2px solid green';
  downloadButtonContainer.style.padding = '2px 5px';
  downloadButtonContainer.style.borderRadius = '4px';
  downloadButtonContainer.appendChild(downloadIconButton);
  downloadButtonContainer.appendChild(downloadTextLabel);
  downloadButtonContainer.classList.add('soundsnap-download-button');

  downloadButtonContainer.addEventListener('mouseenter', () => {
    const aParentContainer = containerElement.parentElement;
    if (!aParentContainer) return;
    const originalPlayButton = aParentContainer.querySelector('.ojoo-button.ojoo-play');
    if (originalPlayButton) {
      originalPlayButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
      originalPlayButton.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
    }
  });

  downloadButtonContainer.addEventListener('mouseleave', () => {
    const aParentContainer = containerElement.parentElement;
    if (!aParentContainer) return;
    const originalPlayButton = aParentContainer.querySelector('.ojoo-button.ojoo-play');
    if (originalPlayButton) {
      originalPlayButton.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, cancelable: true, view: window }));
      originalPlayButton.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, view: window }));
    }
  });

  downloadButtonContainer.onclick = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const currentParentContainer = containerElement.parentElement;
    let currentAudioElement = null;
    if (currentParentContainer) {
        currentAudioElement = currentParentContainer.querySelector('audio');
    }
    if (!currentAudioElement && containerElement) {
        currentAudioElement = containerElement.querySelector('audio');
    }

    if (!currentAudioElement) {
        alert('Download Assistant: Could not find the associated audio player element. Please try again.');
        return;
    }

    const src = currentAudioElement.getAttribute('src');
    if (!src || !src.startsWith('/play?')) {
      alert("Download Assistant: Audio source not loaded. Please try hovering over the download button for a moment, or play the sound using Soundsnap's player, then click download again.");
      return;
    }

    const downloadUrl = `https://www.soundsnap.com${src}`;
    const pathParts = downloadUrl.split('/');
    const suggestedFilename = pathParts[pathParts.length - 1].split('?')[0] || "sound.mp3";
    let userFilename = window.prompt("Enter filename (e.g., sound.mp3):", suggestedFilename);

    if (userFilename === null || userFilename.trim() === "") {
      console.log("Download cancelled by user or empty filename.");
      return;
    }
    userFilename = userFilename.replace(/[<>:"/\\|?*]+/g, '_');
    if (!userFilename.toLowerCase().endsWith('.mp3')) {
      if (userFilename.includes('.')) {
        userFilename = userFilename.substring(0, userFilename.lastIndexOf('.')) + '.mp3';
      } else {
        userFilename = userFilename + '.mp3';
      }
    }
    chrome.runtime.sendMessage({ action: 'download', url: downloadUrl, filename: userFilename });
  };

  if (containerElement) {
    containerElement.style.position = 'relative';
    containerElement.appendChild(downloadButtonContainer);
  } else {
    console.warn("Download Assistant: containerElement is null, cannot append button.");
  }
}

function processSoundContainers() {
  const soundContainers = document.querySelectorAll('.wave-container');
  soundContainers.forEach(container => {
    if (container && typeof container.querySelector === 'function' && !container.querySelector('.soundsnap-download-button')) {
      addDownloadButtonToContainer(container);
    }
  });
}

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (typeof node.matches === 'function' && node.matches('.wave-container')) {
            if (typeof node.querySelector === 'function' && !node.querySelector('.soundsnap-download-button')) {
              addDownloadButtonToContainer(node);
            }
          } else if (typeof node.querySelectorAll === 'function') {
            const nestedContainers = node.querySelectorAll('.wave-container');
            nestedContainers.forEach(container => {
              if (container && typeof container.querySelector === 'function' && !container.querySelector('.soundsnap-download-button')) {
                addDownloadButtonToContainer(container);
              }
            });
          }
        }
      });
    }
  }
});

console.log('Download Assistant content script loaded.');
if (typeof observer !== 'undefined' && observer) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  console.warn("Download Assistant: MutationObserver not initialized.");
} 